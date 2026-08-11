import React, { useState } from 'react';
import { Applicant } from '../types';
import { DIVISIONS_LIST, COURSES_LIST } from '../data/mockData';
import { 
  PAKISTAN_LOCATION_DATA, 
  ALL_PROVINCES, 
  getDivisionsForProvince, 
  getCitiesForDivision 
} from '../data/locations';
import { validateFileUpload, generateE2EHash, createNotification } from '../utils/security';
import { SADAAT_LOGO_URL, MAIN_SADAAT_LOGO_URL, AL_KASB_LOGO_URL } from '../assets/logo';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  X,
  Award,
  Calendar,
  Sparkles,
  UserX,
  FileCheck,
  BookOpen
} from 'lucide-react';

interface AdmissionFormProps {
  onAddApplicant: (applicant: Applicant) => void;
  onOpenCardModal: (applicant: Applicant) => void;
  availableCourses?: string[];
  availableDivisions?: string[];
  lang: 'ur' | 'en';
}

export const AdmissionForm: React.FC<AdmissionFormProps> = ({
  onAddApplicant,
  onOpenCardModal,
  availableCourses = COURSES_LIST,
  availableDivisions = DIVISIONS_LIST,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  // Form State
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('2003-01-01');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState('');

  // Location Hierarchy State (Province -> Division -> City)
  const [selectedProvince, setSelectedProvince] = useState(ALL_PROVINCES[0]); // Punjab
  const [selectedDivision, setSelectedDivision] = useState(getDivisionsForProvince(ALL_PROVINCES[0])[0]); // Lahore Division
  const [selectedCity, setSelectedCity] = useState(getCitiesForDivision(ALL_PROVINCES[0], getDivisionsForProvince(ALL_PROVINCES[0])[0])[0]); // Lahore

  const [selectedCourse, setSelectedCourse] = useState(COURSES_LIST[0]);
  const [address, setAddress] = useState('');

  // Location Handlers
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    const divs = getDivisionsForProvince(province);
    const firstDiv = divs[0] || '';
    setSelectedDivision(firstDiv);
    const cities = getCitiesForDivision(province, firstDiv);
    setSelectedCity(cities[0] || '');
  };

  const handleDivisionChange = (div: string) => {
    setSelectedDivision(div);
    const cities = getCitiesForDivision(selectedProvince, div);
    setSelectedCity(cities[0] || '');
  };

  // Photos & Docs
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [photoFileName, setPhotoFileName] = useState<string | undefined>(undefined);
  const [isWithoutPhoto, setIsWithoutPhoto] = useState<boolean>(false);

  const [documentUrl, setDocumentUrl] = useState<string | undefined>(undefined);
  const [documentFileName, setDocumentFileName] = useState<string | undefined>(undefined);

  // Errors & Security Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApplicant, setSubmittedApplicant] = useState<Applicant | null>(null);
  const [emailAlert, setEmailAlert] = useState<string | null>(null);

  // Format CNIC with dashes automatically
  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 13) val = val.slice(0, 13);
    
    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12)}`;
    }
    setCnic(formatted);
  };

  // Handle Photo Upload with Security Validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, photo: '' }));
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFileUpload(file, true);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, photo: isUrdu ? validation.errorUrdu! : validation.errorEnglish! }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setPhotoUrl(evt.target?.result as string);
      setPhotoFileName(file.name);
      setIsWithoutPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  // Toggle "Without Photo" (بغیر تصویر)
  const handleWithoutPhotoToggle = () => {
    if (isWithoutPhoto) {
      setIsWithoutPhoto(false);
    } else {
      setIsWithoutPhoto(true);
      setPhotoUrl(undefined);
      setPhotoFileName(undefined);
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, document: '' }));
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFileUpload(file, false);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, document: isUrdu ? validation.errorUrdu! : validation.errorEnglish! }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setDocumentUrl(evt.target?.result as string);
      setDocumentFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Validate Form
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = isUrdu ? 'مکمل نام درج کریں' : 'Full Name is required';
    if (!fatherName.trim()) errs.fatherName = isUrdu ? 'والد کا نام درج کریں' : 'Father Name is required';
    
    if (!cnic.trim() || cnic.length < 15) {
      errs.cnic = isUrdu ? 'درست شناختی کارڈ نمبر (13 ہندسے) درج کریں' : 'Valid 13-digit CNIC is required';
    }

    if (!phone.trim()) errs.phone = isUrdu ? 'موبائل نمبر درج کریں' : 'Phone number is required';
    if (!email.trim() || !email.includes('@')) {
      errs.email = isUrdu ? 'درست ای میل ایڈریس درج کریں' : 'Valid email is required';
    }

    if (!education.trim()) errs.education = isUrdu ? 'تعلیمی قابلیت درج کریں' : 'Education is required';
    if (!address.trim()) errs.address = isUrdu ? 'مکمل پتہ درج کریں' : 'Address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const trackingNo = `SADAAT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const rollNo = `SADAAT-2026-RN-${Math.floor(100 + Math.random() * 900)}`;

      const fullLocation = `${selectedCity} — ${selectedDivision}`;

      const formDataPayload = {
        fullName,
        fatherName,
        cnic,
        email,
        phone,
        division: fullLocation,
        selectedCourse,
        education,
        createdAt: new Date().toISOString()
      };

      const encryptedHash = generateE2EHash(formDataPayload);

      const newApplicant: Applicant = {
        id: 'app-' + Date.now(),
        trackingNumber: trackingNo,
        rollNumber: rollNo,
        fullName,
        fatherName,
        cnic,
        dob,
        gender,
        phone,
        email,
        education,
        division: fullLocation,
        selectedCourse,
        address,
        photoUrl: isWithoutPhoto ? undefined : photoUrl,
        photoFileName: isWithoutPhoto ? undefined : photoFileName,
        documentUrl,
        documentFileName,
        status: 'approved', // Auto-approve upon full submission for instant roll number card demo
        adminNote: 'بین الاقوامی تنظیم السادات آن لائن رجسٹریشن اور ای میل تصدیق مکمل ہو چکی ہے۔',
        isFullyCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        encryptedDataHash: encryptedHash,
        examCenter: `مرکزی دفتر بین الاقوامی تنظیم السادات، ڈویژن ${selectedDivision}`,
        examDate: '20 اگست 2026 (صبح 10:00 بجے)',
      };

      // Dispatch automated email notification
      const notif = createNotification(newApplicant, 'submission_received');

      onAddApplicant(newApplicant);
      setSubmittedApplicant(newApplicant);
      setIsSubmitting(false);

      setEmailAlert(
        isUrdu
          ? `خودکار ای میل نوٹیفکیشن [${newApplicant.email}] پر کامیابی سے بھیج دیا گیا ہے!`
          : `Automated email notification sent to [${newApplicant.email}]!`
      );
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Title & Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 relative overflow-hidden border-b-4 border-amber-400">
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-right">
          {/* Side-By-Side Dual Official Logos */}
          <div className="flex items-center justify-center gap-3 shrink-0">
            {/* First Logo: Al Kasbo / IT Council Logo */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-100 p-1 border-2 border-amber-400 shadow-xl overflow-hidden group hover:scale-105 transition-all">
                <img 
                  src={AL_KASB_LOGO_URL} 
                  alt="الكاسب حبيب الله — آئی ٹی سپورٹ کونسل Logo" 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-urdu font-bold text-amber-300 mt-1">الكاسب حبيب الله</span>
            </div>

            {/* Divider Dot / Cross Icon */}
            <span className="text-amber-400 font-bold text-lg hidden sm:inline-block">+</span>

            {/* Second Logo: Main Organization Seal Logo */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 p-1 border-2 border-amber-400 shadow-xl overflow-hidden group hover:scale-105 transition-all">
                <img 
                  src={MAIN_SADAAT_LOGO_URL} 
                  alt="بین الاقوامی تنظیم السادات Main Organization Logo" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[10px] font-urdu font-bold text-amber-300 mt-1">مرکزی تنظیم السادات</span>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'کورس آغاز: 20 اگست 2026' : 'Course Starts: 20 August 2026'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-urdu leading-tight text-white">
              بین الاقوامی تنظیم السادات — آن لائن رجسٹریشن
            </h1>

            <p className="text-amber-300 font-bold text-sm sm:text-base font-urdu">
              مختلف کورسز کے لیے آن لائن رجسٹریشن و داخلہ پورٹل 2026
            </p>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="absolute left-6 bottom-4 hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-[11px] font-mono text-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>E2E ENCRYPTED FORM</span>
        </div>
      </div>

      {/* SUCCESS CARD AFTER SUBMISSION */}
      {submittedApplicant ? (
        <div className="bg-white rounded-3xl shadow-xl border-2 border-emerald-600 p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-urdu text-emerald-950">
              {isUrdu ? 'درخواست کامیابی کے ساتھ جمع ہو گئی ہے!' : 'Application Submitted Successfully!'}
            </h2>
            <p className="text-sm text-slate-600 font-urdu">
              آپ کی درخواست کا ٹریکنگ نمبر درج ذیل ہے۔ ہم نے آپ کے ای میل پر تصدیقی پیغام بھیج دیا ہے۔
            </p>
          </div>

          {/* Email Alert Banner */}
          {emailAlert && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{emailAlert}</span>
            </div>
          )}

          {/* Tracking ID Badge */}
          <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-6 max-w-md mx-auto space-y-2">
            <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">
              YOUR OFFICIAL TRACKING ID
            </span>
            <div className="text-3xl font-black font-mono text-emerald-900">
              {submittedApplicant.trackingNumber}
            </div>
            <div className="text-xs text-emerald-700 font-semibold font-urdu">
              رول نمبر: {submittedApplicant.rollNumber}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenCardModal(submittedApplicant)}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm font-urdu"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>ایڈمیشن کارڈ کی تصدیق و پرنٹ (View & Print Admission Card)</span>
            </button>

            <button
              onClick={() => {
                setSubmittedApplicant(null);
                setFullName('');
                setFatherName('');
                setCnic('');
                setEmail('');
                setPhone('');
                setAddress('');
                setPhotoUrl(undefined);
                setDocumentUrl(undefined);
              }}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-6 py-3 rounded-2xl transition-colors text-sm font-urdu"
            >
              نیا داخلہ فارم پر کریں
            </button>
          </div>
        </div>
      ) : (
        /* MAIN FORM FORMULARY */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 sm:p-10 space-y-8">
          
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-emerald-900">
              <User className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold font-urdu">
                {isUrdu ? '1. ذاتی معلومات (Personal Information)' : '1. Personal Information'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  امیدوار کا مکمل نام (Full Name) *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isUrdu ? 'مثال: محمد علی رضوی' : 'e.g. Muhammad Ali Rizvi'}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-600 font-urdu mt-1">{errors.fullName}</p>}
              </div>

              {/* Father Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  والد کا نام (Father Name) *
                </label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder={isUrdu ? 'مثال: حسن عباس رضوی' : 'e.g. Hassan Abbas Rizvi'}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.fatherName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.fatherName && <p className="text-xs text-red-600 font-urdu mt-1">{errors.fatherName}</p>}
              </div>

              {/* CNIC */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  شناختی کارڈ / بی فارم نمبر (CNIC) *
                </label>
                <input
                  type="text"
                  value={cnic}
                  onChange={handleCnicChange}
                  placeholder="xxxxx-xxxxxxx-x"
                  maxLength={15}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono transition-all ${
                    errors.cnic ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.cnic && <p className="text-xs text-red-600 font-urdu mt-1">{errors.cnic}</p>}
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                    تاریخ پیدائش *
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                    جنس (Gender)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600"
                  >
                    <option value="male">{isUrdu ? 'مرد (Male)' : 'Male'}</option>
                    <option value="female">{isUrdu ? 'خواتین (Female)' : 'Female'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Division */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-emerald-900">
              <Phone className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold font-urdu">
                {isUrdu ? '2. رابطہ و ڈویژن کی تفصیلا (Contact & Division)' : '2. Contact & Division Details'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  موبائل نمبر (Mobile / WhatsApp) *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 font-urdu mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  ای میل ایڈریس (Email Address) *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="applicant@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                <span className="text-[11px] text-slate-500 font-urdu block mt-0.5">
                  منظوری کا خودکار ای میل نوٹیفکیشن اس ایڈریس پر بھیجا جائے گا
                </span>
                {errors.email && <p className="text-xs text-red-600 font-urdu mt-1">{errors.email}</p>}
              </div>

              {/* Selected Course (مختلف کورسز کے لیے آن لائن رجسٹریشن) */}
              <div className="sm:col-span-2 bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-300 space-y-1.5">
                <label className="block text-xs font-bold text-amber-950 font-urdu flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>مختلف کورسز کا انتخاب (Select Course for Online Registration) *</span>
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-amber-400 bg-white text-sm font-bold font-urdu text-emerald-950 focus:border-emerald-600 shadow-sm"
                >
                  {availableCourses.map((crs) => (
                    <option key={crs} value={crs}>{crs}</option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-800 font-urdu">
                  بین الاقوامی تنظیم السادات کے تحت تمام کورسز 20 اگست 2026 سے آن لائن فراہم کیے جائیں گے۔
                </p>
              </div>

              {/* Pakistan Location Hierarchy: Province, Division, City */}
              <div className="sm:col-span-2 bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold font-urdu text-sm">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>پاکستان کے صوبے، ڈویژن اور شہر کا انتخاب (Location Selection) *</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Province Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                      صوبہ / علاقہ (Province) *
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-urdu text-slate-800 bg-white focus:border-emerald-600"
                    >
                      {ALL_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  {/* Division Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                      ڈویژن / زون (Division) *
                    </label>
                    <select
                      value={selectedDivision}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-urdu text-slate-800 bg-white focus:border-emerald-600"
                    >
                      {getDivisionsForProvince(selectedProvince).map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>

                  {/* City Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                      شہر / ضلع (City / District) *
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold font-urdu text-emerald-900 bg-white focus:border-emerald-600"
                    >
                      {getCitiesForDivision(selectedProvince, selectedDivision).map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 font-urdu bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-200">
                  انتخاب کردہ مقام: <strong className="text-emerald-950">{selectedCity} — {selectedDivision} ({selectedProvince})</strong>
                </div>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  تعلیمی قابلیت (Education) *
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder={isUrdu ? 'مثال: Matric, F.Sc, BS Computer Science' : 'e.g. BS Computer Science'}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.education ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.education && <p className="text-xs text-red-600 font-urdu mt-1">{errors.education}</p>}
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  موجودہ پتہ (Current Postal Address) *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isUrdu ? 'مکان نمبر، اسٹریٹ، شہر کا نام' : 'House No, Street, City'}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.address ? 'border-red-500 bg-red-50/30' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {errors.address && <p className="text-xs text-red-600 font-urdu mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: File Uploads & Security Checks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-emerald-900">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-bold font-urdu">
                  {isUrdu ? '3. تصویر اور اسناد کا اپلوڈ (Photo & Document Uploads)' : '3. Photo & Document Uploads'}
                </h2>
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md">
                حفاظتی فارمیٹ چیک فعال ہے
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Candidate Photo Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-urdu">
                    امیدوار کی پاسپورٹ سائز تصویر (Max 2MB - JPG/PNG)
                  </span>
                  <button
                    type="button"
                    onClick={handleWithoutPhotoToggle}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold font-urdu transition-all ${
                      isWithoutPhoto 
                        ? 'bg-amber-100 text-amber-900 border-amber-300' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300'
                    }`}
                  >
                    {isWithoutPhoto ? '✓ بغیر تصویرمنتخب ہے' : 'تصویر کے بغیر (Without Photo)'}
                  </button>
                </div>

                {isWithoutPhoto ? (
                  <div className="p-6 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/50 text-center space-y-2">
                    <UserX className="w-8 h-8 text-amber-600 mx-auto" />
                    <span className="text-xs font-bold text-amber-900 font-urdu block">
                      آپ نے "بغیر تصویر" کا انتخاب کیا ہے
                    </span>
                    <span className="text-[11px] text-amber-700 block">
                      ایڈمیشن کارڈ پر "بغیر تصویر" کا نشان ظاہر ہوگا۔
                    </span>
                  </div>
                ) : photoUrl ? (
                  <div className="relative w-28 h-36 mx-auto rounded-xl overflow-hidden border-2 border-emerald-600 shadow-md">
                    <img src={photoUrl} alt="Candidate" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl(undefined);
                        setPhotoFileName(undefined);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-emerald-800 font-urdu">
                      تصویر سلیکٹ کریں (Select Photo)
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Max Size: 2MB | Formats: JPG, PNG, WEBP
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {errors.photo && <p className="text-xs text-red-600 font-urdu text-center">{errors.photo}</p>}
              </div>

              {/* Educational Document Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-800 font-urdu block">
                  تعلیمی اسناد / شناختی کارڈ کاپی (Max 5MB - PDF/JPG)
                </span>

                {documentUrl ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span className="text-xs font-mono font-semibold text-emerald-950 truncate">
                        {documentFileName || 'document.pdf'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentUrl(undefined);
                        setDocumentFileName(undefined);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs font-bold"
                    >
                      حذف کریں
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-semibold text-emerald-800 font-urdu">
                      فائل اپلوڈ کریں (Upload Doc)
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Max Size: 5MB | Formats: PDF, JPG, PNG
                    </span>
                    <input
                      type="file"
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {errors.document && <p className="text-xs text-red-600 font-urdu text-center">{errors.document}</p>}
              </div>
            </div>
          </div>

          {/* E2E Security Badge Notice */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-urdu">
                آپ کی تمام معلومات اینڈ ٹو اینڈ انکرپشن سے محفوظ ہیں۔
              </span>
            </div>
            <div className="font-mono text-amber-300/80 text-[11px]">
              E2EE HASH VALIDATION ACTIVE
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 hover:from-emerald-900 hover:to-emerald-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-base font-urdu cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>درخواست پروسیس ہو رہی ہے...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>آن لائن درخواست جمع کریں اور ایڈمیشن کارڈ حاصل کریں</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
};
