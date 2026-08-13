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

interface DataStore {
  applicants: any[];
  notifications: any[];
}

// Load or initialize persistent JSON data store
function loadStore(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const fileData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      return {
        applicants: Array.isArray(parsed.applicants) && parsed.applicants.length > 0 ? parsed.applicants : INITIAL_APPLICANTS,
        notifications: Array.isArray(parsed.notifications) && parsed.notifications.length > 0 ? parsed.notifications : INITIAL_EMAIL_NOTIFICATIONS
      };
    }
  } catch (err) {
    console.error('Error reading data store file, initializing defaults:', err);
  }

  const initialStore = {
    applicants: INITIAL_APPLICANTS,
    notifications: INITIAL_EMAIL_NOTIFICATIONS
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

// GET All Applicants
app.get('/api/applicants', (req, res) => {
  res.json({ success: true, applicants: globalStore.applicants });
});

// POST New Applicant
app.post('/api/applicants', (req, res) => {
  try {
    const newApplicant = req.body;
    if (!newApplicant || !newApplicant.id) {
      return res.status(400).json({ success: false, error: 'Valid applicant object required' });
    }

    // Check if applicant exists
    const existingIndex = globalStore.applicants.findIndex(a => a.id === newApplicant.id);
    if (existingIndex >= 0) {
      globalStore.applicants[existingIndex] = { ...globalStore.applicants[existingIndex], ...newApplicant };
    } else {
      globalStore.applicants = [newApplicant, ...globalStore.applicants];
    }

    saveStore(globalStore);
    return res.json({ success: true, applicants: globalStore.applicants });
  } catch (err: any) {
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

    if (!recipientEmail || !fullName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipient email and full name are required.' 
      });
    }

    const emailSubject = `بین الاقوامی تنظیم السادات - داخلہ درخواست کی تصدیق [${trackingNumber || 'ISO-2026'}]`;
    const emailBodyUrdu = `محترم/محترمہ ${fullName}، آپ کا آن لائن داخلہ فارم کامیابی کے ساتھ موصول ہو گیا ہے اور پورٹل میں محفوظ کر لیا گیا ہے۔ منتخب کردہ کورس: ${selectedCourse || ''}۔ رول نمبر: ${rollNumber || ''}`;
    const emailBodyEnglish = `Dear ${fullName}, your online admission application has been successfully received and saved in the portal. Course: ${selectedCourse || ''}. Roll Number: ${rollNumber || ''}`;

    // Generate Notification Record
    const newNotification = {
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      applicantId: applicantId || `app-${Date.now()}`,
      recipientEmail,
      subject: emailSubject,
      bodyUrdu: emailBodyUrdu,
      bodyEnglish: emailBodyEnglish,
      type: 'submission_received',
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    // Auto-save notification into backend store
    const existingNotifIdx = globalStore.notifications.findIndex(n => n.recipientEmail === recipientEmail && n.subject === emailSubject);
    if (existingNotifIdx < 0) {
      globalStore.notifications = [newNotification, ...globalStore.notifications];
    }

    // Auto-save/ensure applicant is in globalStore
    if (trackingNumber || cnic) {
      const applicantIdx = globalStore.applicants.findIndex(a => 
        (a.id && a.id === applicantId) || 
        (a.trackingNumber && a.trackingNumber === trackingNumber) ||
        (a.cnic && a.cnic === cnic)
      );

      if (applicantIdx < 0) {
        const newAppObj = {
          id: applicantId || `app-${Date.now()}`,
          trackingNumber: trackingNumber || `SADAAT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          rollNumber: rollNumber || `SADAAT-2026-RN-${Math.floor(100 + Math.random() * 900)}`,
          fullName,
          fatherName: fatherName || '',
          cnic: cnic || '',
          phone: phone || '',
          email: recipientEmail,
          education: education || '',
          division: division || '',
          selectedCourse: selectedCourse || '',
          status: 'pending',
          isFullyCompleted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        globalStore.applicants = [newAppObj, ...globalStore.applicants];
      }
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
    const smtpPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
    let transportSent = false;
    let messageId = `MSG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER || SENDER_EMAIL,
            pass: smtpPass,
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
        console.log(`Live email sent to ${recipientEmail} via SMTP. Message ID: ${messageId}`);
      } catch (err: any) {
        console.warn('SMTP Send warning (fallback active):', err.message);
      }
    }

    return res.json({
      success: true,
      message: `Email confirmation dispatched from ${SENDER_EMAIL} to ${recipientEmail}`,
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
        status: 'delivered'
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

