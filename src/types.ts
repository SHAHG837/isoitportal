export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Applicant {
  id: string;
  trackingNumber: string; // e.g., ISO-2026-9821
  rollNumber?: string; // e.g., ISO-ROLL-4091
  fullName: string;
  fatherName: string;
  cnic: string;
  dob: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  education: string;
  division: string; // e.g. Lahore, Karachi, Gilgit, Quetta, Multan, etc.
  selectedCourse?: string; // Course selected e.g. "بنیادی کمپیوٹر کورس", "ایڈوانس اے آئی کورس", "ڈیجیٹل مارکیٹنگ کورس", "ورڈپریس کمپلیٹ کورس", "ایس ای او کمپلیٹ کورس"
  address: string;
  photoUrl?: string; // If undefined or empty -> "بغیر تصویر"
  photoFileName?: string;
  documentUrl?: string;
  documentFileName?: string;
  status: ApplicationStatus;
  adminNote?: string;
  isFullyCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  encryptedDataHash?: string; // End-to-end encryption hash verification
  examCenter?: string;
  examDate?: string;
}

export interface EmailNotification {
  id: string;
  applicantId: string;
  recipientEmail: string;
  subject: string;
  bodyUrdu: string;
  bodyEnglish: string;
  type: 'submission_received' | 'status_approved' | 'status_rejected';
  sentAt: string;
  status: 'sent' | 'delivered';
}

export interface CourseModule {
  id: string;
  titleUrdu: string;
  titleEnglish: string;
  descriptionUrdu: string;
  descriptionEnglish: string;
  duration: string;
  lessonsCount: number;
  completedLessons: number;
  isUnlocked: boolean;
  videoUrl?: string;
  quizCompleted?: boolean;
  score?: number;
}

export interface StudentProgress {
  studentName: string;
  rollNumber: string;
  cnic: string;
  courseTitle: string;
  startDate: string; // 1 September 2026
  completionPercentage: number;
  modules: CourseModule[];
  certificateIssued: boolean;
  assignmentsSubmitted: number;
  totalAssignments: number;
}
