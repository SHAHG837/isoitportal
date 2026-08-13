import React, { useState } from 'react';
import { Applicant } from '../types';
import { 
  UserCheck, 
  Search, 
  X, 
  BookOpen, 
  Printer, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  FileText,
  Calendar,
  Sparkles,
  Edit
} from 'lucide-react';
import { SADAAT_LOGO_URL } from '../assets/logo';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  availableCourses: string[];
  onUpdateApplicantCourse: (applicantId: string, newCourse: string) => void;
  onOpenCardModal: (applicant: Applicant) => void;
  onGoToApply: () => void;
  lang?: 'ur' | 'en';
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  applicants = [],
  availableCourses = [],
  onUpdateApplicantCourse = (_applicantId: string, _newCourse: string) => {},
  onOpenCardModal = (_applicant: Applicant) => {},
  onGoToApply = () => {},
  lang = 'ur'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedInStudent, setLoggedInStudent] = useState<Applicant | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [error, setError] = useState('');
  const [courseSavedSuccess, setCourseSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStudentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCourseSavedSuccess(false);

    const raw = searchQuery.trim().toLowerCase();
    const digitsOnly = raw.replace(/\D/g, '');
    const list = applicants || [];

    const found = list.find(app => {
      const cleanCnic = (app.cnic || '').toLowerCase().replace(/\D/g, '');
      const cleanTrack = (app.trackingNumber || '').toLowerCase();
      const cleanRoll = (app.rollNumber || '').toLowerCase();
      const cleanPhone = (app.phone || '').toLowerCase().replace(/\D/g, '');
      const cleanEmail = (app.email || '').toLowerCase().trim();
      const cleanName = (app.fullName || '').toLowerCase().trim();

      if (digitsOnly.length >= 3) {
        if (cleanCnic.includes(digitsOnly) || cleanPhone.includes(digitsOnly)) return true;
        if (cleanTrack.replace(/\D/g, '').includes(digitsOnly)) return true;
        if (cleanRoll.replace(/\D/g, '').includes(digitsOnly)) return true;
      }

      if (cleanTrack.includes(raw) || cleanRoll.includes(raw)) return true;
      if (cleanEmail.includes(raw) || cleanName.includes(raw)) return true;
      if ((app.cnic || '').toLowerCase().includes(raw)) return true;

      return false;
    });

    if (found) {
      setLoggedInStudent(found);
      setSelectedCourse(found.selectedCourse || availableCourses[0] || '');
    } else {
      setError(`شناختی کارڈ / ٹریکنگ ID (${searchQuery}) کا کوئی ریکارڈ نہیں ملا۔`);
      setLoggedInStudent(null);
    }
  };

  const handleCourseSave = () => {
    if (!loggedInStudent) return;

    onUpdateApplicantCourse(loggedInStudent.id, selectedCourse);
    
    setLoggedInStudent(prev => prev ? { ...prev, selectedCourse } : null);
    setCourseSavedSuccess(true);
    setTimeout(() => setCourseSavedSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-800 w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 relative border-b-4 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 text-emerald-200 hover:text-white bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 p-0.5 border-2 border-amber-400 shadow-xl overflow-hidden shrink-0">
              <img
                src={SADAAT_LOGO_URL}
                alt="بین الاقوامی تنظیم السادات Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider font-urdu mb-1">
                <UserCheck className="w-3.5 h-3.5" />
                <span>طالب علم لاگ ان و ایڈمیشن پورٹل</span>
              </div>
              <h2 className="text-xl font-black font-urdu text-white">
                بین الاقوامی تنظیم السادات — طالب علم پورٹل
              </h2>
              <p className="text-xs text-amber-300 font-urdu">
                شناختی کارڈ (CNIC) یا ٹریکنگ نمبر کے ذریعے اپنے فارم اور ایڈمیشن کارڈ تک رسائی حاصل کریں
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!loggedInStudent ? (
            /* Student Search/Login Form */
            <form onSubmit={handleStudentSearch} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-r-4 border-red-600 p-3 rounded-xl flex items-start gap-2.5 text-red-800 text-xs font-urdu">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p>{error}</p>
                    <button
                      type="button"
                      onClick={() => { onClose(); onGoToApply(); }}
                      className="text-emerald-800 font-bold underline mt-1 block"
                    >
                      → آن لائن داخلہ فارم پر کریں (New Admission)
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 font-urdu flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>CNIC یا ٹریکنگ ID یا موبائل نمبر درج کریں *</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="شناختی کارڈ (CNIC) یا ٹریکنگ نمبر درج کریں..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md text-xs font-urdu flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-amber-300" />
                    <span>لاگ ان کریں</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Student Profile View & Course Management */
            <div className="space-y-5">
              {/* Student Header Summary */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-950 text-base font-urdu">{loggedInStudent.fullName}</span>
                    <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold font-mono">
                      {loggedInStudent.status === 'approved' ? 'منظور شدہ (Approved)' : 'زیرِ جائزہ (Pending)'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-urdu flex flex-wrap gap-3">
                    <span>والد: {loggedInStudent.fatherName}</span>
                    <span>•</span>
                    <span>CNIC: <strong className="font-mono">{loggedInStudent.cnic}</strong></span>
                    <span>•</span>
                    <span>ٹریکنگ ID: <strong className="font-mono text-emerald-900">{loggedInStudent.trackingNumber}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setLoggedInStudent(null)}
                  className="text-xs text-slate-500 hover:text-red-600 underline font-urdu"
                >
                  لاگ آؤٹ کریں (Logout)
                </button>
              </div>

              {/* Course Selection & Update Box */}
              <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-amber-950 font-urdu flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>اپنی پسند کے کورس کا انتخاب کریں (Select / Change Course) *</span>
                  </label>
                  <span className="text-[11px] text-amber-800 font-urdu font-bold">2026 آن لائن سیشن</span>
                </div>

                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-amber-400 bg-white text-xs sm:text-sm font-bold font-urdu text-emerald-950 focus:border-emerald-700 shadow-xs"
                >
                  {availableCourses.map((crs) => (
                    <option key={crs} value={crs}>{crs}</option>
                  ))}
                </select>

                <div className="flex items-center justify-between pt-1">
                  {courseSavedSuccess ? (
                    <span className="text-xs text-emerald-700 font-bold font-urdu flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      کورس کامیابی سے تبدیل ہو گیا!
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-800 font-urdu">
                      انتخاب محفوظ کرنے کیلئے نیچے دیے گئے بٹن پر کلک کریں۔
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleCourseSave}
                    className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-5 py-2 rounded-xl text-xs font-urdu shadow-md transition-all cursor-pointer"
                  >
                    کورس تبدیل محفوظ کریں
                  </button>
                </div>
              </div>

              {/* Admission Card Print / Download CTA */}
              <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 rounded-2xl shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm font-urdu text-amber-300 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>ایڈمیشن کارڈ و رول نمبر کارڈ</span>
                    </h3>
                    <p className="text-xs text-emerald-100 font-urdu mt-0.5">
                      اپنی کلاسز اور آن لائن پورٹل پر داخلے کیلئے اپنا تصدیقی ایڈمیشن کارڈ ڈاؤن لوڈ کریں
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenCardModal(loggedInStudent);
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-5 py-2.5 rounded-xl text-xs font-urdu shadow-md flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    <Printer className="w-4 h-4" />
                    <span>ایڈمیشن کارڈ ڈاؤن لوڈ / پرنٹ</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
