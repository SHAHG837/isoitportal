import React from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  ShieldCheck, 
  Globe, 
  Search, 
  Sparkles,
  Award
} from 'lucide-react';
import { SADAAT_LOGO_URL } from '../assets/logo';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'ur' | 'en';
  setLang: (lang: 'ur' | 'en') => void;
  onOpenTrackModal: () => void;
  onOpenAdminLoginModal?: () => void;
  onOpenStudentLoginModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onOpenTrackModal,
  onOpenAdminLoginModal,
  onOpenStudentLoginModal,
}) => {
  const isUrdu = lang === 'ur';

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-emerald-100">
      {/* Announcement Bar */}
      <div className="bg-emerald-900 text-emerald-50 px-4 py-2 text-xs md:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-right">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className={isUrdu ? 'font-urdu' : ''}>
              {isUrdu 
                ? '📢 بین الاقوامی تنظیم السادات: مختلف کورسز کے لیے آن لائن رجسٹریشن و داخلہ جاری ہے!'
                : '📢 International Sadaat Organization: Online Registration for Various Courses Open!'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenTrackModal}
              className="flex items-center gap-1.5 text-xs bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'درخواست ٹریک کریں' : 'Track Application'}</span>
            </button>

            {onOpenStudentLoginModal && (
              <button
                onClick={onOpenStudentLoginModal}
                className="flex items-center gap-1 text-xs bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer font-urdu"
              >
                <Award className="w-3.5 h-3.5" />
                <span>طالب علم لاگ ان</span>
              </button>
            )}

            {onOpenAdminLoginModal && (
              <button
                onClick={onOpenAdminLoginModal}
                className="flex items-center gap-1 text-xs bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold px-2.5 py-1 rounded-md border border-amber-400/30 transition-colors cursor-pointer font-urdu"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>ایڈمن لاگ ان</span>
              </button>
            )}

            <button
              onClick={() => setLang(isUrdu ? 'en' : 'ur')}
              className="flex items-center gap-1 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-semibold">{isUrdu ? 'English' : 'اردو'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-full bg-amber-100 p-0.5 border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img 
                src={SADAAT_LOGO_URL} 
                alt="بین الاقوامی تنظیم السادات Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className={`text-lg sm:text-xl font-black text-emerald-950 tracking-tight leading-tight ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'بین الاقوامی تنظیم السادات' : 'INTERNATIONAL SADAAT ORGANIZATION'}
              </div>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className={isUrdu ? 'font-urdu' : ''}>
                  {isUrdu ? 'مختلف کورسز کے لیے آن لائن رجسٹریشن' : 'Online Registration for Various Courses'}
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              {isUrdu ? 'صفحہ اول' : 'Home'}
            </button>

            <button
              onClick={() => setCurrentTab('apply')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'apply'
                  ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isUrdu ? 'آن لائن داخلہ' : 'Online Admission'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>{isUrdu ? 'اسٹوڈنٹ ڈیش بورڈ' : 'Student Dashboard'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('card-preview')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'card-preview'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/80'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span>{isUrdu ? 'ایڈمیشن کارڈ' : 'Admission Card'}</span>
            </button>

            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-slate-900 text-amber-300 font-semibold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? 'ایڈمن پینل' : 'Admin Portal'}</span>
            </button>
          </nav>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 text-xs no-scrollbar">
          <button
            onClick={() => setCurrentTab('home')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              currentTab === 'home' ? 'bg-emerald-700 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isUrdu ? 'صفحہ اول' : 'Home'}
          </button>
          <button
            onClick={() => setCurrentTab('apply')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              currentTab === 'apply' ? 'bg-emerald-700 text-white font-semibold' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            {isUrdu ? 'داخلہ فارم' : 'Apply'}
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              currentTab === 'dashboard' ? 'bg-emerald-700 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isUrdu ? 'ڈیش بورڈ' : 'Dashboard'}
          </button>
          <button
            onClick={() => setCurrentTab('card-preview')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              currentTab === 'card-preview' ? 'bg-emerald-700 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isUrdu ? 'ایڈمیشن کارڈ' : 'Admission Card'}
          </button>
          <button
            onClick={() => setCurrentTab('admin')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md ${
              currentTab === 'admin' ? 'bg-slate-900 text-amber-300 font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {isUrdu ? 'ایڈمن' : 'Admin'}
          </button>
        </div>
      </div>
    </header>
  );
};
