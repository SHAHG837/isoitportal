import React, { useState } from 'react';
import { Applicant } from '../types';
import { Search, X, CheckCircle2, Clock, XCircle, Award, AlertCircle } from 'lucide-react';

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  onOpenCardModal: (applicant: Applicant) => void;
  lang: 'ur' | 'en';
}

export const TrackModal: React.FC<TrackModalProps> = ({
  isOpen,
  onClose,
  applicants = [],
  onOpenCardModal,
  lang,
}) => {
  const isUrdu = lang === 'ur';
  const [query, setQuery] = useState('');
  const [foundApplicant, setFoundApplicant] = useState<Applicant | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const raw = query.trim().toLowerCase();
    const digitsOnly = raw.replace(/\D/g, '');
    let list = applicants || [];

    const searchInList = (arr: Applicant[]) => {
      return arr.find(a => {
        const cleanCnic = (a.cnic || '').toLowerCase().replace(/\D/g, '');
        const cleanTrack = (a.trackingNumber || '').toLowerCase();
        const cleanRoll = (a.rollNumber || '').toLowerCase();
        const cleanPhone = (a.phone || '').toLowerCase().replace(/\D/g, '');
        const cleanEmail = (a.email || '').toLowerCase().trim();
        const cleanName = (a.fullName || '').toLowerCase().trim();

        // Check digits only match (for CNIC or Phone or digits of tracking/roll)
        if (digitsOnly.length >= 3) {
          if (cleanCnic.includes(digitsOnly) || cleanPhone.includes(digitsOnly)) return true;
          if (cleanTrack.replace(/\D/g, '').includes(digitsOnly)) return true;
          if (cleanRoll.replace(/\D/g, '').includes(digitsOnly)) return true;
        }

        // Check string matches
        if (cleanTrack.includes(raw) || cleanRoll.includes(raw)) return true;
        if (cleanEmail.includes(raw) || cleanName.includes(raw)) return true;
        if ((a.cnic || '').toLowerCase().includes(raw)) return true;

        return false;
      });
    };

    let result = searchInList(list);

    if (!result) {
      try {
        const res = await fetch('/api/applicants');
        const data = await res.json();
        if (res.ok && data?.success && Array.isArray(data.applicants)) {
          list = data.applicants;
          result = searchInList(list);
        }
      } catch (err) {
        console.warn('Track backend search error:', err);
      }
    }

    setFoundApplicant(result || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 font-bold font-urdu text-emerald-950 text-lg">
            <Search className="w-5 h-5 text-emerald-700" />
            <span>درخواست کی صورتحال دریافت کریں (Track Application)</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 font-urdu">
            ٹریکنگ نمبر یا شناختی کارڈ درج کریں (e.g. ISO-2026-9481 or CNIC)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              placeholder="ٹریکنگ نمبر یا CNIC درج کریں..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-emerald-600"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-urdu transition-colors"
            >
              تلاش کریں
            </button>
          </div>
        </form>

        {/* Search Result Display */}
        {searched && (
          <div>
            {foundApplicant ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4 font-urdu">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <span className="text-xs text-slate-500">امیدوار کا نام:</span>
                  <span className="font-bold text-emerald-950 text-base">{foundApplicant.fullName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">ٹریکنگ ID:</span>
                  <span className="font-mono font-bold text-emerald-900">{foundApplicant.trackingNumber}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">ڈویژن:</span>
                  <span className="font-bold text-slate-800">{foundApplicant.division}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">موجودہ صورتحال:</span>
                  {foundApplicant.status === 'approved' && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> درخواست منظور ہے
                    </span>
                  )}
                  {foundApplicant.status === 'pending' && (
                    <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> زیرِ جائزہ
                    </span>
                  )}
                  {foundApplicant.status === 'rejected' && (
                    <span className="bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> نامنظور
                    </span>
                  )}
                </div>

                {foundApplicant.adminNote && (
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700">
                    <strong>ایڈمن نوٹ:</strong> {foundApplicant.adminNote}
                  </div>
                )}

                {/* Open Admission Card if Approved & Completed */}
                {foundApplicant.status === 'approved' && foundApplicant.isFullyCompleted ? (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCardModal(foundApplicant);
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>ایڈمیشن کارڈ کی تصدیق و پرنٹ (Print Card)</span>
                  </button>
                ) : foundApplicant.status === 'pending' ? (
                  <div className="bg-amber-100/80 border border-amber-300 p-3 rounded-xl text-amber-950 text-xs font-urdu space-y-1 text-center">
                    <div className="font-bold text-amber-900">ایڈمن پینل سے منظوری کے بعد ایڈمیشن کارڈ ڈاؤن لوڈ کیا جا سکے گا</div>
                    <div className="text-[11px] text-amber-800 font-medium">کلاسز کا باقاعدہ آغاز: 1 ستمبر 2026</div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2 font-urdu">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <div className="font-bold text-slate-800">کوئی ریکارڈ نہیں ملا</div>
                <div className="text-xs text-slate-500">
                  براہ کرم ٹریکنگ نمبر یا شناختی کارڈ کی درستی چیک کریں۔
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
