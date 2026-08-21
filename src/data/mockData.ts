import { Applicant, CourseModule, EmailNotification, StudentProgress } from '../types';

export const COURSES_LIST = [
  'بنیادی کمپیوٹر کورس (Basic Computer Course)',
  'ایڈوانس اے آئی کورس (Advance AI Course)',
  'ڈیجیٹل مارکیٹنگ کورس (Digital Marketing Course)',
  'ورڈپریس کمپلیٹ کورس (WordPress Complete Course)',
  'ایس ای او کمپلیٹ کورس (SEO Complete Course)'
];

export const DIVISIONS_LIST = [
  'لاہور (Lahore)',
  'کراچی (Karachi)',
  'راولپنڈی / اسلام آباد (Rawalpindi / Islamabad)',
  'کوئٹہ (Quetta)',
  'گلگت بلتستان (Gilgit-Baltistan)',
  'پشاور (Peshawar)',
  'ملتان (Multan)',
  'حیدرآباد (Hyderabad)',
  'فیصل آباد (Faisalabad)',
  'مظفر آباد (Muzaffarabad)',
  'سرگودھا (Sargodha)',
  'سکھر (Sukkur)',
  'ڈی آئی خان (D.I. Khan)'
];

export const INITIAL_APPLICANTS: Applicant[] = [];

export const INITIAL_EMAIL_NOTIFICATIONS: EmailNotification[] = [];

export const COURSE_MODULES_2026: CourseModule[] = [
  {
    id: 'mod-1',
    titleUrdu: 'ماڈیول 1: بنیادی کمپیوٹر و ونڈوز آفس (Basic Computer Course)',
    titleEnglish: 'Module 1: Basic Computer, Operating System & MS Office',
    descriptionUrdu: 'کمپیوٹر کی بنیادی ساخت، ونڈوز آپریٹنگ سسٹم، ایم ایس ورڈ، ایکسل، پاورپوائنٹ اور انٹرنیٹ کا استعمال۔',
    descriptionEnglish: 'Computer fundamentals, Windows OS, MS Office suite, internet and email essentials.',
    duration: '2 ہفتے (8 اسباق)',
    lessonsCount: 8,
    completedLessons: 8,
    isUnlocked: true,
    quizCompleted: true,
    score: 95,
  },
  {
    id: 'mod-2',
    titleUrdu: 'ماڈیول 2: ایڈوانس اے آئی و آرٹیفیشل انٹیلیجنس (Advance AI Course)',
    titleEnglish: 'Module 2: Advance AI, Prompt Engineering & Automation',
    descriptionUrdu: 'جدید اے آئی ٹولز، پرامپٹ انجینئرنگ، چیٹ جی پی ٹی، مڈجرنی، کاپائلٹ اور آٹومیشن ٹیکنالوجیز۔',
    descriptionEnglish: 'Advanced AI tools, prompt engineering, ChatGPT, Midjourney, Copilot, and workflow automation.',
    duration: '3 ہفتے (12 اسباق)',
    lessonsCount: 12,
    completedLessons: 9,
    isUnlocked: true,
    quizCompleted: true,
    score: 88,
  },
  {
    id: 'mod-3',
    titleUrdu: 'ماڈیول 3: ڈیجیٹل مارکیٹنگ و سوشل میڈیا (Digital Marketing Course)',
    titleEnglish: 'Module 3: Digital Marketing & Social Media Campaign Strategy',
    descriptionUrdu: 'سوشل میڈیا مارکیٹنگ، فیس بک واٹس ایپ ایڈز، برانڈنگ، کنٹینٹ اسٹریٹیجی اور فیر لانسنگ۔',
    descriptionEnglish: 'Social media marketing, Facebook & WhatsApp ads, brand positioning, content strategy, freelancing.',
    duration: '2 ہفتے (6 اسباق)',
    lessonsCount: 6,
    completedLessons: 2,
    isUnlocked: true,
    quizCompleted: false,
    score: 0,
  },
  {
    id: 'mod-4',
    titleUrdu: 'ماڈیول 4: ورڈپریس ڈیولپمنٹ و ایس ای او کمپلیٹ (WordPress & SEO Complete)',
    titleEnglish: 'Module 4: WordPress Web Development & Search Engine Optimization',
    descriptionUrdu: 'ورڈپریس ویب سائٹس کی تعمیر، ای کامرس اسٹورز، اور سرچ انجن آپٹمائزیشن (SEO) کی مکمل عملی تربیت۔',
    descriptionEnglish: 'WordPress website building, WooCommerce e-commerce stores, and comprehensive SEO optimization.',
    duration: '2 ہفتے (6 اسباق)',
    lessonsCount: 6,
    completedLessons: 0,
    isUnlocked: false,
    quizCompleted: false,
    score: 0,
  }
];

export const DEMO_STUDENT_PROGRESS: StudentProgress = {
  studentName: 'طالب علم (Registered Student)',
  rollNumber: 'SADAAT-2026-RN-***',
  cnic: 'xxxxx-xxxxxxx-x',
  courseTitle: 'بنیادی کمپیوٹر کورس (Basic Computer Course)',
  startDate: '1 ستمبر 2026 (1 September 2026)',
  completionPercentage: 59,
  modules: COURSE_MODULES_2026,
  certificateIssued: false,
  assignmentsSubmitted: 4,
  totalAssignments: 6,
};
