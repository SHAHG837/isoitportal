import React from 'react';
import { Applicant } from '../types';
import { CheckCircle2, Shield, Calendar, MapPin, QrCode, AlertCircle, Building, UserX, BookOpen } from 'lucide-react';
import { SADAAT_LOGO_URL, MAIN_SADAAT_LOGO_URL, AL_KASB_LOGO_URL } from '../assets/logo';

interface AdmissionCardProps {
  applicant: Applicant;
  isUrdu?: boolean;
}

export const AdmissionCard: React.FC<AdmissionCardProps> = ({ applicant, isUrdu = true }) => {
  const rollNo = applicant.rollNumber || `SADAAT-2026-RN-${applicant.trackingNumber.slice(-4)}`;
  const examCenter = applicant.examCenter || `مرکزی دفتر بین الاقوامی تنظیم السادات، ڈویژن ${applicant.division}`;
  const examDate = applicant.examDate || '20 اگست 2026 (صبح 10:00 بجے)';
  const courseName = applicant.selectedCourse || 'مختلف کورسز - آن لائن رجسٹریشن 2026';

  return (
    <div className="print-only-card bg-white border-2 border-emerald-800 rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto my-4 text-slate-800 font-sans">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 relative border-b-4 border-amber-400">
        <div className="absolute top-2 left-4 text-emerald-200/20 text-xs font-mono">
          REF: {applicant.encryptedDataHash || 'SADAAT-SEC-2026'}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            {/* Dual Logos Crests */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Logo 1: Al Kasb IT Council Logo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-amber-100 p-0.5 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={AL_KASB_LOGO_URL} 
                  alt="الكاسب حبيب الله Logo" 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Logo 2: Main Organization Seal Logo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 p-0.5 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={MAIN_SADAAT_LOGO_URL} 
                  alt="بین الاقوامی تنظیم السادات Main Logo" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div>
              <div className="text-amber-300 text-[11px] font-arabic tracking-widest">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ</div>
              <h1 className="text-base sm:text-xl font-black font-urdu leading-snug">
                بین الاقوامی تنظیم السادات
              </h1>
              <p className="text-amber-300 text-xs font-bold font-urdu">
                آئی ٹی سپورٹ کونسل — الكاسب حبيب الله 2026
              </p>
            </div>
          </div>

          <div className="text-right sm:border-r border-emerald-700/60 sm:pr-4 pl-2">
            <div className="inline-block bg-amber-400 text-emerald-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              {isUrdu ? 'رول نمبر / ایڈمیشن کارڈ' : 'ADMISSION CARD'}
            </div>
            <div className="text-white text-xs font-mono font-semibold">
              TRACKING ID: <span className="text-amber-300">{applicant.trackingNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
        {/* Verification Status Badge */}
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs md:text-sm font-semibold text-emerald-900">
              {isUrdu ? 'تصدیق شدہ امتحانی رجسٹریشن — داخلہ کارڈ درست ہے' : 'Verified Registration — Official Examination Slip'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-700 text-white px-2.5 py-1 rounded-md">
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>20 اگست 2026</span>
          </div>
        </div>

        {/* Candidate Details & Photo Column */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Photo Box or "بغیر تصویر" Badge */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <div className="w-32 h-40 border-2 border-emerald-700 rounded-xl overflow-hidden bg-slate-100 shadow-md flex items-center justify-center relative">
              {applicant.photoUrl ? (
                <img
                  src={applicant.photoUrl}
                  alt={applicant.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center bg-slate-100 w-full h-full text-slate-500">
                  <UserX className="w-10 h-10 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700 font-urdu bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                    بغیر تصویر
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    (Without Photo)
                  </span>
                </div>
              )}
              {/* Corner Watermark */}
              <div className="absolute bottom-1 right-1 bg-emerald-900/80 text-amber-300 text-[8px] font-mono px-1 rounded">
                ISO 2026
              </div>
            </div>
            <div className="text-[10px] text-slate-500 mt-2 font-mono text-center">
              Candidate Reference
            </div>
          </div>

          {/* Candidate Bio Table */}
          <div className="md:col-span-3 space-y-3">
            {/* Selected Course Display */}
            <div className="bg-amber-50/90 border border-amber-300 p-3 rounded-lg shadow-2xs font-urdu flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold text-amber-950">منتخب کردہ کورس (Registered Course):</span>
              </div>
              <span className="font-bold text-emerald-950 text-xs sm:text-sm">{courseName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block font-urdu">نامِ امیدوار (Full Name)</span>
                <span className="font-bold text-slate-900 text-base">{applicant.fullName}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block font-urdu">والد کا نام (Father's Name)</span>
                <span className="font-semibold text-slate-900">{applicant.fatherName}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block font-urdu">شناختی کارڈ / بی فارم (CNIC)</span>
                <span className="font-mono font-bold text-emerald-900">{applicant.cnic}</span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block font-urdu">مقصود ڈویژن / زون (Division)</span>
                <span className="font-semibold text-slate-900">{applicant.division}</span>
              </div>
            </div>

            {/* Roll Number Box */}
            <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-600/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">
                  ASSIGNED EXAMINATION ROLL NUMBER
                </span>
                <span className="text-2xl font-black font-mono text-emerald-950 tracking-wider">
                  {rollNo}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-600 block">تعليمى قابلیت</span>
                <span className="text-xs font-semibold text-slate-800">{applicant.education}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Schedule & Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-urdu block">تاریخ و وقت (Date & Time)</span>
              <span className="font-bold text-slate-900 text-sm">{examDate}</span>
              <span className="text-[11px] text-emerald-700 block font-medium mt-0.5">
                کورس آغاز: 20 اگست 2026
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-urdu block">امتحانی مرکز / پورٹل (Center)</span>
              <span className="font-bold text-slate-900 text-sm">{examCenter}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                آن لائن یا متعلقہ ڈویژنل آفس
              </span>
            </div>
          </div>
        </div>

        {/* Instructions & Security Seal */}
        <div className="border-t border-slate-200 pt-5 space-y-4">
          <div className="bg-slate-100/80 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5 font-urdu text-sm">
              <AlertCircle className="w-4 h-4 text-emerald-700" />
              <span>امیدواران کیلئے ضروری ہدایات (Instructions)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 font-urdu">
              <li>امتحان/کورس سیشن کے وقت یہ ایڈمیشن کارڈ اور اصلی شناختی کارڈ اپنے پاس رکھیں۔</li>
              <li>تمام آن لائن لیکچرز 20 اگست 2026 سے اسٹوڈنٹ ڈیش بورڈ پر دستیاب ہوں گے۔</li>
              <li>رول نمبر اور ٹریکنگ آئی ڈی کسی دوسرے شخص کے ساتھ شیئر نہ کریں۔</li>
            </ul>
          </div>

          {/* Footer Bar with QR and Signatures */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-dashed border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-300 rounded-lg flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                <div>QR VERIFIED PASS</div>
                <div>SEC-HASH: {applicant.encryptedDataHash || 'E2E-SHA256-OK'}</div>
                <div>ISSUE DATE: 2026-08-11</div>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-64 h-10 border-b border-slate-400 mb-1 flex items-end justify-center font-urdu text-xs text-emerald-900 font-bold italic">
                سید محمد عامر نقوی (چیئرمین آئی ٹی سپورٹ کونسل)
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-urdu block">
                دستخط و مہر چیئرمین آئی ٹی سپورٹ کونسل
              </span>
              <span className="text-[9px] text-slate-500 font-bold">
                International Sadaat Organization
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
