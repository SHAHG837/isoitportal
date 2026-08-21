import { Applicant, EmailNotification } from '../types';

export const MAX_PHOTO_SIZE_MB = 2;
export const MAX_DOC_SIZE_MB = 5;

export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export interface FileValidationResult {
  isValid: boolean;
  errorUrdu?: string;
  errorEnglish?: string;
}

export function validateFileUpload(file: File, isPhoto: boolean): FileValidationResult {
  const maxSize = isPhoto ? MAX_PHOTO_SIZE_MB * 1024 * 1024 : MAX_DOC_SIZE_MB * 1024 * 1024;
  const allowedTypes = isPhoto ? ALLOWED_PHOTO_TYPES : ALLOWED_DOC_TYPES;

  if (file.size > maxSize) {
    const limit = isPhoto ? `${MAX_PHOTO_SIZE_MB}MB` : `${MAX_DOC_SIZE_MB}MB`;
    return {
      isValid: false,
      errorUrdu: `فائل کا سائز ${limit} سے زیادہ نہیں ہونا چاہیے`,
      errorEnglish: `File size must not exceed ${limit}`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      errorUrdu: isPhoto 
        ? 'صرف تصویر (JPG, PNG, WEBP) فارمیٹ اپلوڈ کریں'
        : 'صرف PDF یا تصویر (JPG, PNG) فارمیٹ اپلوڈ کریں',
      errorEnglish: isPhoto
        ? 'Please upload image format only (JPG, PNG, WEBP)'
        : 'Please upload PDF or Image formats only',
    };
  }

  return { isValid: true };
}

// Simple deterministic hash simulation for End-to-End Encryption verification
export function generateE2EHash(data: Record<string, any>): string {
  const jsonStr = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'E2E-SHA256-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

// Automatic email notification generator
export function createNotification(
  applicant: Applicant,
  type: 'submission_received' | 'status_approved' | 'status_rejected',
  note?: string
): EmailNotification {
  let subject = '';
  let bodyUrdu = '';
  let bodyEnglish = '';

  if (type === 'submission_received') {
    subject = `ISO Pakistan - درخواست موصول ہو گئی [${applicant.trackingNumber}]`;
    bodyUrdu = `محترم/محترمہ ${applicant.fullName}،\n\nآپ کی آن لائن داخلہ درخواست کامیابی کے ساتھ جمع ہو چکی ہے۔\nٹریکنگ نمبر: ${applicant.trackingNumber}\nشعبہ/ڈویژن: ${applicant.division}\n\nدرخواست پر جائزہ کا عمل جاری ہے۔ منظوری کی صورت میں آپ کو نیا ای میل موصول ہوگا جس کے بعد آپ اپنا ایڈمیشن کارڈ ڈاؤن لوڈ کر سکیں گے۔`;
    bodyEnglish = `Dear ${applicant.fullName},\n\nYour online admission application has been received successfully.\nTracking No: ${applicant.trackingNumber}\nDivision: ${applicant.division}\n\nYour application is under review. Upon approval, you will receive an email to download your Admission Card.`;
  } else if (type === 'status_approved') {
    subject = `ISO Pakistan - داخلہ درخواست منظور ہو گئی [${applicant.trackingNumber}]`;
    bodyUrdu = `مبارک ہو! محترم/محترمہ ${applicant.fullName}،\n\nآپ کی ڈیجیٹل کورس (1 ستمبر 2026) کیلئے داخلہ درخواست منظور کر لی گئی ہے۔\nرول نمبر: ${applicant.rollNumber || 'ISO-ROLL-2026'}\nامتحانی مرکز: ${applicant.examCenter || 'آن لائن / متعلقہ مرکز'}\n${note ? `نوٹ: ${note}\n` : ''}\nبرائے مہربانی اپنا ایڈمیشن کارڈ پورٹل سے پرنٹ/ڈاؤن لوڈ کریں۔`;
    bodyEnglish = `Congratulations ${applicant.fullName},\n\nYour admission application for Digital Course (Starts 1 Sep 2026) has been APPROVED.\nRoll No: ${applicant.rollNumber || 'ISO-ROLL-2026'}\nExam Center: ${applicant.examCenter || 'Online / Regional Center'}\n${note ? `Note: ${note}\n` : ''}\nPlease download your Admission Card from the portal.`;
  } else {
    subject = `ISO Pakistan - داخلہ درخواست کے بارے میں اطلاع [${applicant.trackingNumber}]`;
    bodyUrdu = `محترم/محترمہ ${applicant.fullName}،\n\nآپ کی داخلہ درخواست [${applicant.trackingNumber}] فی الحال منظور نہیں کی جا سکی۔\n${note ? `سبب / ایڈمن نوٹ: ${note}\n` : ''}\nاگر کوئی درستی درکار ہے تو براہ کرم دوبارہ فارم پر کریں۔`;
    bodyEnglish = `Dear ${applicant.fullName},\n\nYour admission application [${applicant.trackingNumber}] could not be approved at this time.\n${note ? `Reason / Admin Note: ${note}\n` : ''}\nPlease contact administration if you need further clarification.`;
  }

  return {
    id: 'EML-' + Math.floor(100000 + Math.random() * 900000),
    applicantId: applicant.id,
    recipientEmail: applicant.email,
    subject,
    bodyUrdu,
    bodyEnglish,
    type,
    sentAt: new Date().toISOString(),
    status: 'sent',
  };
}
