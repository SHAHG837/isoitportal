import React, { useState } from 'react';
import { Applicant } from '../types';
import { AdmissionCard } from './AdmissionCard';
import { printAdmissionCardPDF } from '../utils/export';
import { 
  X, 
  Printer, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Download,
  Image as ImageIcon,
  UserX,
  Building,
  CheckCircle2
} from 'lucide-react';

interface AdmissionCardModalProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
  isUrdu?: boolean;
}

export const AdmissionCardModal: React.FC<AdmissionCardModalProps> = ({
  applicant,
  isOpen,
  onClose,
  isUrdu = true,
}) => {
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [cardFormat, setCardFormat] = useState<'a4' | 'nic'>('a4');
  const [validatedItems, setValidatedItems] = useState<{
    logo: boolean;
    tracking: boolean;
    details: boolean;
    photo: boolean;
    center: boolean;
  }>({
    logo: false,
    tracking: false,
    details: false,
    photo: false,
    center: false,
  });

  if (!isOpen || !applicant) return null;

  const isFormComplete = applicant.isFullyCompleted;

  const toggleCheck = (key: keyof typeof validatedItems) => {
    setValidatedItems(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const allChecked = Object.values(next).every(Boolean);
      if (allChecked) setIsValidated(true);
      return next;
    });
  };

  const handleValidateAll = () => {
    setValidatedItems({
      logo: true,
      tracking: true,
      details: true,
      photo: true,
      center: true,
    });
    setIsValidated(true);
  };

  const handlePrint = () => {
    printAdmissionCardPDF(applicant, cardFormat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 px-6 flex items-center justify-between border-b border-emerald-700/60 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400 text-emerald-950 rounded-xl">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-urdu leading-tight">
                {isUrdu ? 'پیش نظارہ و معلومات کی تصدیق (Admission Card Validation)' : 'Admission Card Preview & Validation'}
              </h2>
              <p className="text-xs text-emerald-200">
                {isUrdu 
                  ? 'پرنٹ کرنے سے پہلے برائے مہربانی تمام معلومات کی تصدیق کریں'
                  : 'Please review and confirm all details prior to printing or downloading'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-700/60 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Check 1: Is Form Fully Completed? */}
          {!isFormComplete ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-urdu text-amber-950">
                  فارم نا مکمل ہے — ایڈمیشن کارڈ ڈاؤن لوڈ دستیاب نہیں!
                </h3>
                <p className="text-sm text-amber-800 max-w-lg mx-auto">
                  ایڈمیشن کارڈ صرف اس وقت ڈاؤن لوڈ اور پرنٹ کیا جا سکتا ہے جب درخواست فارم مکمل طور پر پر کیا گیا ہو اور ضروری معلومات فراہم کی گئی ہوں۔
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                فارم کی ترامیم کیلئے واپس جائیں
              </button>
            </div>
          ) : applicant.status !== 'approved' ? (
            /* Check 2: Is Application Approved by Admin? */
            <div className="bg-amber-50/90 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div className="space-y-3 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-950 font-black text-xs px-3.5 py-1 rounded-full font-urdu">
                  <span>صورتحال: {applicant.status === 'rejected' ? 'درخواست نامنظور (Rejected)' : 'درخواست زیرِ جائزہ (Pending Admin Approval)'}</span>
                </div>

                <h3 className="text-2xl font-black font-urdu text-amber-950">
                  {applicant.status === 'rejected' 
                    ? 'داخلہ درخواست نامنظور کر دی گئی ہے'
                    : 'ایڈمیشن کارڈ ایڈمن پینل سے منظوری کے بعد ڈاؤن لوڈ کیا جا سکے گا'}
                </h3>

                <p className="text-sm text-slate-700 font-urdu leading-relaxed">
                  {applicant.status === 'rejected'
                    ? `محترم/محترمہ ${applicant.fullName}، آپ کی داخلہ درخواست منظور نہیں ہو سکی۔ نوٹ: ${applicant.adminNote || 'براہ کرم دوبارہ درست کوائف کے ساتھ فارم پر کریں۔'}`
                    : `محترم/محترمہ ${applicant.fullName}، آپ کی داخلہ درخواست کامیابی کے ساتھ موصول ہو چکی ہے اور ایڈمن پینل کی جانچ کے مرحلے میں ہے۔ ایڈمن پینل کی جانب سے باضابطہ منظوری (Approval) کے بعد آپ کا تصدیق شدہ ایڈمیشن کارڈ اور رول نمبر کارڈ یہاں ڈاؤن لوڈنگ اور پرنٹنگ کے لیے فعال کر دیا جائے گا۔`}
                </p>
              </div>

              {/* Application Details Summary Box */}
              <div className="bg-white border border-amber-300 rounded-2xl p-4 sm:p-5 max-w-md mx-auto text-right space-y-2 text-xs font-urdu shadow-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">امیدوار کا نام:</span>
                  <span className="font-bold text-slate-900">{applicant.fullName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">ٹریکنگ ID:</span>
                  <span className="font-mono font-bold text-emerald-900">{applicant.trackingNumber}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">منتخب کردہ کورس:</span>
                  <span className="font-bold text-amber-950">{applicant.selectedCourse || 'مختلف کورسز'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">ڈویژن:</span>
                  <span className="font-bold text-slate-800">{applicant.division}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 pt-1 font-bold">
                  <span>کلاسز کا باقاعدہ آغاز:</span>
                  <span>1 ستمبر 2026 (September 1, 2026)</span>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 py-2.5 rounded-xl transition-all text-xs font-urdu shadow-md"
                >
                  سمجھ گیا، بند کریں (Close)
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Validation Step Section (If not yet validated) */}
              {!isValidated && (
                <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-6 space-y-5 no-print">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-emerald-700" />
                      <h3 className="text-base font-bold text-emerald-950 font-urdu">
                        گام 1: لوگو، ٹریکنگ نمبر اور کوائف کی تصدیق (Mandatory Verification)
                      </h3>
                    </div>
                    <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-3 py-1 rounded-full">
                      مرحلہ 1 از 2
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-urdu">
                    پرنٹ یا پی ڈی ایف ڈاؤن لوڈ بٹن کو فعال کرنے کیلئے درج ذیل تمام باکسز چیک کریں:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                    {/* Checkbox 1: Logo */}
                    <div
                      onClick={() => toggleCheck('logo')}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                        validatedItems.logo
                          ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {validatedItems.logo ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-urdu block font-bold">1. لوگو اور مہر کی تصدیق</span>
                        <span className="text-[11px] text-slate-500">بین الاقوامی تنظیم السادات کا سرکاری نشان موجود ہے</span>
                      </div>
                    </div>

                    {/* Checkbox 2: Tracking Number */}
                    <div
                      onClick={() => toggleCheck('tracking')}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                        validatedItems.tracking
                          ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {validatedItems.tracking ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-urdu block font-bold">2. ٹریکنگ نمبر کی تصدیق</span>
                        <span className="text-[11px] font-mono text-emerald-800">
                          {applicant.trackingNumber}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox 3: Applicant Details */}
                    <div
                      onClick={() => toggleCheck('details')}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                        validatedItems.details
                          ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {validatedItems.details ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-urdu block font-bold">3. نام و شناختی کارڈ کی درستی</span>
                        <span className="text-[11px] text-slate-500">
                          {applicant.fullName} | CNIC: {applicant.cnic}
                        </span>
                      </div>
                    </div>

                    {/* Checkbox 4: Photo status */}
                    <div
                      onClick={() => toggleCheck('photo')}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                        validatedItems.photo
                          ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {validatedItems.photo ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div className="flex items-center gap-2">
                        {applicant.photoUrl ? (
                          <ImageIcon className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <UserX className="w-4 h-4 text-amber-600" />
                        )}
                        <div>
                          <span className="font-urdu block font-bold">4. تصویر / بغیر تصویر تصدیق</span>
                          <span className="text-[11px] text-slate-500">
                            {applicant.photoUrl ? 'تصویر منسلک ہے' : 'بغیر تصویر مہر شدہ'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkbox 5: Exam Center & Date */}
                    <div
                      onClick={() => toggleCheck('center')}
                      className={`cursor-pointer p-3.5 rounded-xl border flex items-center gap-3 md:col-span-2 transition-all ${
                        validatedItems.center
                          ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {validatedItems.center ? (
                        <CheckSquare className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-urdu block font-bold">5. امتحانی تاریخ و ڈویژن کی تصدیق</span>
                        <span className="text-[11px] text-slate-500">
                          کلاسز آغاز: 1 ستمبر 2026 | ڈویژن: {applicant.division}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleValidateAll}
                      className="text-xs text-emerald-800 hover:underline font-semibold font-urdu"
                    >
                      ✓ تمام معلومات پر ایک ساتھ تصدیق لگائیں (Select All Validation)
                    </button>

                    <button
                      onClick={() => setIsValidated(true)}
                      className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm font-urdu"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>معلومات درست ہیں — ایڈمیشن کارڈ دیکھیں</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status Banner & Format Selector when validated */}
              {isValidated && (
                <div className="bg-emerald-800 text-emerald-50 p-4 rounded-2xl space-y-3 no-print text-xs md:text-sm font-urdu shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-300" />
                      <span className="font-bold">تمام کوائف کی تصدیق ہو گئی ہے! پرنٹ فارمیٹ منتخب کریں:</span>
                    </div>
                    <button
                      onClick={() => setIsValidated(false)}
                      className="text-xs text-amber-300 underline font-sans"
                    >
                      تصدیق دوبارہ کریں
                    </button>
                  </div>

                  {/* Format Selector Tabs */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setCardFormat('a4')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-xs sm:text-sm ${
                        cardFormat === 'a4'
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg scale-[1.02]'
                          : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/80 hover:bg-emerald-700/60'
                      }`}
                    >
                      <span>📄 A4 سائز پرنٹ (1 سنگل پیج)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCardFormat('nic')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all font-bold text-xs sm:text-sm ${
                        cardFormat === 'nic'
                          ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-lg scale-[1.02]'
                          : 'bg-emerald-900/60 text-emerald-100 border-emerald-700/80 hover:bg-emerald-700/60'
                      }`}
                    >
                      <span>💳 NIC سمارٹ جیبی کارڈ سائز</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Admission Card Live Render Component */}
              <div className="bg-slate-100 p-2 sm:p-4 rounded-2xl border border-slate-200">
                <AdmissionCard applicant={applicant} isUrdu={isUrdu} />
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 no-print">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition-colors text-sm"
                >
                  بند کریں (Close)
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    disabled={!isValidated}
                    onClick={handlePrint}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md text-sm ${
                      isValidated
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Printer className="w-4 h-4" />
                    <span>ایڈمیشن کارڈ پرنٹ کریں / PDF</span>
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
