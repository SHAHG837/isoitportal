import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { INITIAL_APPLICANTS, INITIAL_EMAIL_NOTIFICATIONS } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'syedmuhammadamir837@gmail.com';
const DATA_FILE_PATH = path.join(process.cwd(), 'sadaat_db_store.json');

interface SmtpConfig {
  senderEmail: string;
  gmailAppPassword?: string;
  smtpHost: string;
  smtpPort: number;
}

interface DataStore {
  applicants: any[];
  notifications: any[];
  smtpConfig?: SmtpConfig;
}

// Load or initialize persistent JSON data store
function loadStore(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      return {
        applicants: Array.isArray(parsed.applicants) && parsed.applicants.length > 0 ? parsed.applicants : INITIAL_APPLICANTS,
        notifications: Array.isArray(parsed.notifications) && parsed.notifications.length > 0 ? parsed.notifications : INITIAL_EMAIL_NOTIFICATIONS,
        smtpConfig: parsed.smtpConfig || {
          senderEmail: SENDER_EMAIL,
          gmailAppPassword: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '',
          smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
          smtpPort: parseInt(process.env.SMTP_PORT || '587', 10)
        }
      };
    }
  } catch (err) {
    console.error('Error reading data store file, initializing defaults:', err);
  }

  const initialStore = {
    applicants: INITIAL_APPLICANTS,
    notifications: INITIAL_EMAIL_NOTIFICATIONS,
    smtpConfig: {
      senderEmail: SENDER_EMAIL,
      gmailAppPassword: process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10)
    }
  };
  saveStore(initialStore);
  return initialStore;
}

function saveStore(store: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data store to file:', err);
  }
}

// Global In-Memory Store synced with file
let globalStore: DataStore = loadStore();

// --- API ENDPOINTS ---

// Admin Authentication Endpoint (ID: admin, Password: admin123)
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'ایڈمن آئی ڈی اور پاس ورڈ درج کرنا لازمی ہے۔' 
      });
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();

    // Accepted Admin Credentials:
    // Usernames: admin, 03323475431, 3323475431, admin@sadaat.org
    // Passwords: admin123, 12345
    const isUserValid = cleanUser === 'admin' || cleanUser === '03323475431' || cleanUser.includes('3323475431') || cleanUser === 'admin@sadaat.org';
    const isPassValid = cleanPass === 'admin123' || cleanPass === '12345';

    if (isUserValid && isPassValid) {
      const token = `sadaat_admin_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log(`[Admin Login Success]: User '${cleanUser}' authenticated at ${new Date().toISOString()}`);
      return res.json({
        success: true,
        message: 'ایڈمن لاگ ان کامیاب ہو گیا!',
        token,
        admin: {
          username: cleanUser,
          role: 'super_admin',
          authenticatedAt: new Date().toISOString()
        }
      });
    }

    console.warn(`[Admin Login Failed]: Invalid attempt with username '${cleanUser}'`);
    return res.status(401).json({
      success: false,
      error: 'غلط ایڈمن آئی ڈی یا پاس ورڈ! برائے مہربانی درست آئی ڈی (admin) اور پاس ورڈ (admin123) درج کریں۔'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET Admin Verification Status
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer sadaat_admin_jwt_')) {
    return res.json({ success: true, authenticated: true });
  }
  return res.json({ success: true, authenticated: false });
});

// GET All Applicants
app.get('/api/applicants', (req, res) => {
  res.json({ success: true, applicants: globalStore.applicants });
});

// POST New Applicant or Upsert
app.post('/api/applicants', (req, res) => {
  try {
    const newApplicant = req.body;
    if (!newApplicant || (!newApplicant.id && !newApplicant.cnic && !newApplicant.trackingNumber)) {
      return res.status(400).json({ success: false, error: 'Valid applicant object required' });
    }

    const applicantId = newApplicant.id || `app-${Date.now()}`;
    const trackingNumber = newApplicant.trackingNumber || `SADAAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const rollNumber = newApplicant.rollNumber || `SADAAT-2026-RN-${Math.floor(100 + Math.random() * 900)}`;

    const fullApplicantObj = {
      ...newApplicant,
      id: applicantId,
      trackingNumber,
      rollNumber: newApplicant.rollNumber || rollNumber,
      status: newApplicant.status || 'approved',
      isFullyCompleted: true,
      updatedAt: new Date().toISOString(),
      createdAt: newApplicant.createdAt || new Date().toISOString()
    };

    // Check if applicant already exists in store by id, trackingNumber, or cnic
    const existingIndex = globalStore.applicants.findIndex(a => 
      (a.id && a.id === fullApplicantObj.id) ||
      (a.trackingNumber && a.trackingNumber === fullApplicantObj.trackingNumber) ||
      (a.cnic && a.cnic.replace(/\D/g, '') === fullApplicantObj.cnic?.replace(/\D/g, ''))
    );

    if (existingIndex >= 0) {
      globalStore.applicants[existingIndex] = { 
        ...globalStore.applicants[existingIndex], 
        ...fullApplicantObj 
      };
      console.log(`[DB Sync]: Updated applicant in backend store: ${fullApplicantObj.fullName} (${fullApplicantObj.trackingNumber})`);
    } else {
      globalStore.applicants = [fullApplicantObj, ...globalStore.applicants];
      console.log(`[DB Sync]: Saved NEW applicant in backend store: ${fullApplicantObj.fullName} (${fullApplicantObj.trackingNumber})`);
    }

    saveStore(globalStore);
    return res.json({ 
      success: true, 
      message: 'درخواست بیک اینڈ فائلز میں کامیابی کے ساتھ محفوظ ہو گئی ہے۔',
      applicant: fullApplicantObj,
      applicants: globalStore.applicants 
    });
  } catch (err: any) {
    console.error('Error saving applicant to backend files:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PUT / Update All Applicants (e.g. status approvals or edits from admin)
app.put('/api/applicants', (req, res) => {
  try {
    const updatedApplicants = req.body;
    if (Array.isArray(updatedApplicants)) {
      globalStore.applicants = updatedApplicants;
      saveStore(globalStore);
      return res.json({ success: true, applicants: globalStore.applicants });
    }
    return res.status(400).json({ success: false, error: 'Expected an array of applicants' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET SMTP Config
app.get('/api/smtp-config', (req, res) => {
  const cfg = globalStore.smtpConfig || {
    senderEmail: SENDER_EMAIL,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587
  };
  res.json({
    success: true,
    senderEmail: cfg.senderEmail || SENDER_EMAIL,
    isConfigured: Boolean(cfg.gmailAppPassword && cfg.gmailAppPassword.trim().length > 0),
    smtpHost: cfg.smtpHost || 'smtp.gmail.com',
    smtpPort: cfg.smtpPort || 587
  });
});

// POST Save SMTP Config
app.post('/api/smtp-config', (req, res) => {
  try {
    const { gmailAppPassword, senderEmail } = req.body;
    globalStore.smtpConfig = {
      senderEmail: senderEmail || SENDER_EMAIL,
      gmailAppPassword: (gmailAppPassword || '').trim(),
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587
    };
    saveStore(globalStore);
    return res.json({ 
      success: true, 
      message: 'SMTP settings updated successfully',
      isConfigured: Boolean(globalStore.smtpConfig.gmailAppPassword)
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST Test Email Dispatch Endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const testRecipient = targetEmail || SENDER_EMAIL;
    const smtpPass = globalStore.smtpConfig?.gmailAppPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

    if (!smtpPass) {
      return res.status(400).json({
        success: false,
        error: 'گوگل ای میل ایپ پاس ورڈ (Gmail App Password) درج نہیں ہے۔ براہ کرم 16 ہندسوں کا ایپ پاس ورڈ درج کریں۔',
        code: 'MISSING_APP_PASSWORD'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SENDER_EMAIL,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"بین الاقوامی تنظیم السادات" <${SENDER_EMAIL}>`,
      to: testRecipient,
      subject: `ٹیسٹ ای میل - بین الاقوامی تنظیم السادات [${Date.now()}]`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0fdf4; border: 2px solid #059669; border-radius: 12px; color: #064e3b; text-align: right; direction: rtl;">
          <h2 style="margin-0 0 10px 0;">بین الاقوامی تنظیم السادات - لائیو ای میل ٹیسٹ</h2>
          <p>یہ لائیو ٹیسٹ ای میل <strong>${SENDER_EMAIL}</strong> سے کامیابی کے ساتھ موصول ہوئی ہے۔</p>
          <p style="font-size: 12px; color: #047857; font-family: monospace; direction: ltr; text-align: left;">
            Sent to: ${testRecipient}<br/>
            Timestamp: ${new Date().toISOString()}<br/>
            Status: SMTP DELIVERED SUCCESS
          </p>
        </div>
      `
    });

    return res.json({
      success: true,
      message: `Test email sent successfully to ${testRecipient}!`,
      messageId: info.messageId,
      accepted: info.accepted
    });
  } catch (err: any) {
    console.error('Test email failed:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'SMTP authentication or connection failed',
      details: err
    });
  }
});

// GET All Email Notifications
app.get('/api/notifications', (req, res) => {
  res.json({ success: true, notifications: globalStore.notifications });
});

// POST New Email Notification
app.post('/api/notifications', (req, res) => {
  try {
    const newNotifs = req.body;
    const itemsToAdd = Array.isArray(newNotifs) ? newNotifs : [newNotifs];

    itemsToAdd.forEach(notif => {
      if (notif && notif.id) {
        const idx = globalStore.notifications.findIndex(n => n.id === notif.id);
        if (idx >= 0) {
          globalStore.notifications[idx] = notif;
        } else {
          globalStore.notifications = [notif, ...globalStore.notifications];
        }
      }
    });

    saveStore(globalStore);
    return res.json({ success: true, notifications: globalStore.notifications });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: Send Automated Admission Email Confirmation
app.post('/api/send-confirmation-email', async (req, res) => {
  try {
    const {
      applicant,
      applicantId,
      recipientEmail,
      fullName,
      fatherName,
      trackingNumber,
      rollNumber,
      selectedCourse,
      division,
      district,
      phone,
      cnic,
      education
    } = req.body;

    const emailToUse = recipientEmail || applicant?.email;
    const nameToUse = fullName || applicant?.fullName;

    if (!emailToUse || !nameToUse) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipient email and full name are required.' 
      });
    }

    const trkNo = trackingNumber || applicant?.trackingNumber || `SADAAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const rllNo = rollNumber || applicant?.rollNumber || `SADAAT-2026-RN-${Math.floor(100 + Math.random() * 900)}`;
    const crs = selectedCourse || applicant?.selectedCourse || '';
    const appId = applicantId || applicant?.id || `app-${Date.now()}`;

    const emailSubject = `بین الاقوامی تنظیم السادات - داخلہ درخواست کی تصدیق [${trkNo}]`;
    const emailBodyUrdu = `محترم/محترمہ ${nameToUse}، آپ کا آن لائن داخلہ فارم کامیابی کے ساتھ موصول ہو گیا ہے اور پورٹل میں محفوظ کر لیا گیا ہے۔ منتخب کردہ کورس: ${crs}۔ رول نمبر: ${rllNo}`;
    const emailBodyEnglish = `Dear ${nameToUse}, your online admission application has been successfully received and saved in the portal. Course: ${crs}. Roll Number: ${rllNo}`;

    // Generate Notification Record
    const newNotification = {
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      applicantId: appId,
      recipientEmail: emailToUse,
      subject: emailSubject,
      bodyUrdu: emailBodyUrdu,
      bodyEnglish: emailBodyEnglish,
      type: 'submission_received',
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    // Auto-save notification into backend store
    const existingNotifIdx = globalStore.notifications.findIndex(n => n.recipientEmail === emailToUse && n.subject === emailSubject);
    if (existingNotifIdx < 0) {
      globalStore.notifications = [newNotification, ...globalStore.notifications];
    }

    // Auto-save/ensure applicant is in globalStore and backend files
    const applicantObjToSave = applicant || {
      id: appId,
      trackingNumber: trkNo,
      rollNumber: rllNo,
      fullName: nameToUse,
      fatherName: fatherName || applicant?.fatherName || '',
      cnic: cnic || applicant?.cnic || '',
      phone: phone || applicant?.phone || '',
      email: emailToUse,
      education: education || applicant?.education || '',
      division: division || applicant?.division || '',
      selectedCourse: crs,
      status: applicant?.status || 'approved',
      isFullyCompleted: true,
      address: applicant?.address || '',
      photoUrl: applicant?.photoUrl,
      photoFileName: applicant?.photoFileName,
      documentUrl: applicant?.documentUrl,
      documentFileName: applicant?.documentFileName,
      examCenter: applicant?.examCenter || `مرکزی دفتر بین الاقوامی تنظیم السادات`,
      examDate: applicant?.examDate || '20 اگست 2026 (صبح 10:00 بجے)',
      createdAt: applicant?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const applicantIdx = globalStore.applicants.findIndex(a => 
      (a.id && a.id === applicantObjToSave.id) || 
      (a.trackingNumber && a.trackingNumber === applicantObjToSave.trackingNumber) ||
      (a.cnic && a.cnic.replace(/\D/g, '') === (applicantObjToSave.cnic || '').replace(/\D/g, ''))
    );

    if (applicantIdx >= 0) {
      globalStore.applicants[applicantIdx] = {
        ...globalStore.applicants[applicantIdx],
        ...applicantObjToSave
      };
      console.log(`[Email Handler]: Updated student record in backend file store: ${applicantObjToSave.fullName}`);
    } else {
      globalStore.applicants = [applicantObjToSave, ...globalStore.applicants];
      console.log(`[Email Handler]: Created new student record in backend file store: ${applicantObjToSave.fullName}`);
    }

    saveStore(globalStore);

    const emailBodyHTML = `
      <div style="font-family: Arial, sans-serif, 'Urdu Nastaliq'; direction: rtl; text-align: right; background-color: #f4f7f6; padding: 25px; border-radius: 12px; color: #111827;">
        <div style="background-color: #064e3b; color: #ffffff; padding: 20px; border-radius: 10px 10px 0 0; border-bottom: 4px solid #f59e0b;">
          <h2 style="margin: 0; font-size: 20px;">بین الاقوامی تنظیم السادات (ISO Pakistan)</h2>
          <p style="margin: 5px 0 0 0; color: #fde68a; font-size: 13px;">سرکاری آن لائن داخلہ تصدیقی ای میل</p>
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; font-weight: bold; color: #064e3b; margin-top: 0;">
            محترم/محترمہ ${fullName}،
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #374151;">
            آپ کا آن لائن داخلہ فارم کامیابی کے ساتھ موصول ہو گیا ہے اور سسٹم میں محفوظ کر لیا گیا ہے۔
          </p>

          <div style="background-color: #f0fdf4; border: 1px border-emerald-300; border-right: 5px solid #059669; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <table style="width: 100%; font-size: 13px; color: #1f2937; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 40%;">ارسال کنندہ ای میل (Sender):</td>
                <td style="padding: 6px 0; color: #059669; font-weight: bold; direction: ltr; text-align: left;">${SENDER_EMAIL}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">ٹریکنگ نمبر (Tracking ID):</td>
                <td style="padding: 6px 0; font-weight: bold; color: #d97706; font-family: monospace;">${trackingNumber || 'ISO-2026-TRK'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">رول نمبر (Roll Number):</td>
                <td style="padding: 6px 0; font-weight: bold; color: #064e3b; font-family: monospace;">${rollNumber || 'ISO-2026-RN-101'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">منتخب کردہ کورس (Selected Course):</td>
                <td style="padding: 6px 0;">${selectedCourse || 'بنیادی کمپیوٹر کورس'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">ڈویژن و اضلاع (Division):</td>
                <td style="padding: 6px 0;">${division || 'لاہور'} ${district ? `(${district})` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">شناختی کارڈ / فارم ب:</td>
                <td style="padding: 6px 0; font-family: monospace;">${cnic || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold;">موبائل نمبر (Contact):</td>
                <td style="padding: 6px 0; font-family: monospace;">${phone || 'N/A'}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; color: #4b5563; line-height: 1.6;">
            آپ کی درخواست زیرِ کاوش ہے۔ منظوری کے بعد آپ اپنے پورٹل سے ایڈمیشن کارڈ پرنٹ اور ڈاؤن لوڈ کر سکیں گے۔
            کورس کلاسز کا باقاعدہ آغاز <strong>20 اگست 2026</strong> سے ہوگا۔
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

          <p style="font-size: 11px; color: #6b7280; text-align: center; margin: 0;">
            یہ ای میل <strong>${SENDER_EMAIL}</strong> سے خودکار طور پر ارسال کی گئی ہے۔ کسی بھی سوال کے لیے رابطہ کریں۔
          </p>
        </div>
      </div>
    `;

    // Check if live SMTP / App Password is set up
    const smtpPass = globalStore.smtpConfig?.gmailAppPassword || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    let transportSent = false;
    let messageId = `MSG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let deliveryError = '';

    if (smtpPass && smtpPass.trim().length > 0) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: SENDER_EMAIL,
            pass: smtpPass.trim(),
          },
        });

        const info = await transporter.sendMail({
          from: `"بین الاقوامی تنظیم السادات" <${SENDER_EMAIL}>`,
          to: recipientEmail,
          subject: emailSubject,
          html: emailBodyHTML,
        });

        messageId = info.messageId || messageId;
        transportSent = true;
        console.log(`Live email physically delivered to ${recipientEmail} via Gmail SMTP. Message ID: ${messageId}`);
      } catch (err: any) {
        deliveryError = err?.message || 'SMTP login or delivery failed';
        console.warn('SMTP Send warning:', deliveryError);
      }
    } else {
      deliveryError = 'Gmail App Password is not configured in Admin Panel SMTP settings.';
    }

    // Update notification status & error in record
    newNotification.status = transportSent ? 'delivered' : (deliveryError ? 'error' : 'sent');
    if (deliveryError) {
      (newNotification as any).deliveryError = deliveryError;
    }

    return res.json({
      success: true,
      message: transportSent 
        ? `Email confirmation physically delivered to ${recipientEmail}` 
        : `Email dispatch recorded. Note: ${deliveryError}`,
      notification: newNotification,
      applicants: globalStore.applicants,
      notifications: globalStore.notifications,
      details: {
        from: SENDER_EMAIL,
        to: recipientEmail,
        subject: emailSubject,
        messageId,
        sentAt: new Date().toISOString(),
        isLiveSmtp: transportSent,
        status: transportSent ? 'delivered' : 'logged_only',
        deliveryError
      }
    });

  } catch (error: any) {
    console.error('Error dispatching email:', error);
    return res.status(500).json({ 
      success: false, 
      error: error?.message || 'Failed to send confirmation email' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    senderEmail: SENDER_EMAIL,
    applicantsCount: globalStore.applicants.length,
    notificationsCount: globalStore.notifications.length 
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Sender email configured as: ${SENDER_EMAIL}`);
  });
}

startServer();

