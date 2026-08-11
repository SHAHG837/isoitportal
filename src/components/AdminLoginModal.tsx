import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, Sparkles, X, CheckCircle2, Phone } from 'lucide-react';
import { SADAAT_LOGO_URL } from '../assets/logo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  lang?: 'ur' | 'en';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang = 'ur'
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Accepted Admin Usernames: admin OR 03323475431
    // Accepted Passwords: admin123 OR 12345
    const isUserValid = cleanUser === 'admin' || cleanUser === '03323475431' || cleanUser.includes('3323475431');
    const isPassValid = cleanPass === 'admin123' || cleanPass === '12345';

    if (isUserValid && isPassValid) {
      onLoginSuccess();
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError('غلط ایڈمن آئی ڈی یا پاسورڈ! برائے مہربانی کوائف دوبارہ چیک کریں۔');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-800 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 text-center relative border-b-4 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 text-emerald-200 hover:text-white bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 rounded-full bg-amber-100 p-0.5 border-2 border-amber-400 shadow-xl mx-auto mb-3 overflow-hidden">
            <img
              src={SADAAT_LOGO_URL}
              alt="بین الاقوامی تنظیم السادات Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider mb-2 font-urdu">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>مرکزی انتظامی لاگ ان</span>
          </div>

          <h2 className="text-xl font-black font-urdu text-white">
            بین الاقوامی تنظیم السادات — ایڈمن لاگ ان
          </h2>
          <p className="text-xs text-amber-300 font-urdu mt-1">
            مکمل انتظامی صلاحیت و پورٹل سیٹنگز کے لیے لاگ ان کریں
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-r-4 border-red-600 p-3 rounded-xl flex items-start gap-2.5 text-red-800 text-xs font-urdu">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 font-urdu flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>ایڈمن آئی ڈی / موبائل نمبر (Admin ID) *</span>
            </label>
            <input
              type="text"
              required
              placeholder="آئی ڈی درج کریں..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200 outline-none font-urdu"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 font-urdu flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>پاسورڈ (Password) *</span>
            </label>
            <input
              type="password"
              required
              placeholder="پاسورڈ درج کریں..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-200 outline-none font-urdu"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg text-sm font-urdu flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>ایڈمن پینل داخل ہوں (Login)</span>
          </button>
        </form>

      </div>
    </div>
  );
};
