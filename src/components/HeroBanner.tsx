import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { SADAAT_LOGO_URL } from '../assets/logo';

interface HeroBannerProps {
  onApply: () => void;
  onDashboard: () => void;
  onTrack: () => void;
  lang: 'ur' | 'en';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onApply,
  onDashboard,
  onTrack,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  return (
    <div className="space-y-12">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-3xl overflow-hidden shadow-2xl border-b-8 border-amber-400">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center space-y-6">
          
          {/* Prominent Official Logo Display */}
          <div className="flex justify-center mb-2">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-amber-100 p-1.5 border-4 border-amber-400 shadow-2xl overflow-hidden group hover:scale-105 transition-transform">
              <img 
                src={SADAAT_LOGO_URL} 
                alt="بین الاقوامی تنظیم السادات Official Emblem" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-5 py-2 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span className={isUrdu ? 'font-urdu' : ''}>
              {isUrdu 
                ? 'مختلف کورسز کے لیے آن لائن رجسٹریشن سیشن 2026'
                : 'Online Registration for Various Courses 2026'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-urdu leading-tight text-white tracking-tight">
            بین الاقوامی تنظیم السادات
          </h1>

          <p className="text-emerald-200 text-base sm:text-2xl font-urdu max-w-3xl mx-auto leading-relaxed font-bold">
            مختلف کورسز کے لیے آن لائن رجسٹریشن — تعلیم، بیداری اور اخلاقی و فکری تربیت کے لیے عالمی آن لائن پورٹل۔
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onApply}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-emerald-950 font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all text-base font-urdu flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-emerald-950" />
              <span>مختلف کورسز کے لیے آن لائن فارم پر کریں</span>
            </button>

            <button
              onClick={onDashboard}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all text-base font-urdu flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>اسٹوڈنٹ پورٹل و نصاب</span>
            </button>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-emerald-800/80 text-xs sm:text-sm font-urdu">
            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
              <span className="text-amber-300 font-bold font-mono text-xl block">2026</span>
              <span className="text-emerald-200">کورس سیشن آغاز</span>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
              <span className="text-amber-300 font-bold font-mono text-xl block">100%</span>
              <span className="text-emerald-200">آن لائن رجسٹریشن</span>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
              <span className="text-amber-300 font-bold font-mono text-xl block">5</span>
              <span className="text-emerald-200">تخصصاتی کورسز</span>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-xl border border-emerald-700/50">
              <span className="text-amber-300 font-bold font-mono text-xl block">E2EE</span>
              <span className="text-emerald-200">محفوظ اینڈ ٹو اینڈ ڈیٹا</span>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-urdu text-emerald-950">
            20 اگست 2026 کورس سیشن
          </h3>
          <p className="text-xs text-slate-600 font-urdu leading-relaxed">
            بنیادی کمپیوٹر، ایڈوانس اے آئی، ڈیجیٹل مارکیٹنگ، ورڈ پریس کمپلیٹ، ایس ای او کمپلیٹ کورسز۔
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-urdu text-emerald-950">
            تصدیق شدہ ایڈمیشن کارڈ
          </h3>
          <p className="text-xs text-slate-600 font-urdu leading-relaxed">
            کامل فارم جمع کرنے پر فوری پیش نظارہ، معلومات کی تصدیق اور پرنٹ فرینڈلی رول نمبر سلپ کی فراہمی۔
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-urdu text-emerald-950">
            خودکار ای میل اور سیکیورٹی
          </h3>
          <p className="text-xs text-slate-600 font-urdu leading-relaxed">
            درخواست موصول ہونے، منظوری یا نامنظوری پر امیدوار کو خودکار ای میل نوٹیفکیشن اور ڈیٹا انکرپشن۔
          </p>
        </div>

      </div>
    </div>
  );
};
