import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { SADAAT_LOGO_URL } from '../assets/logo';

interface FooterProps {
  lang: 'ur' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isUrdu = lang === 'ur';

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-amber-400 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 p-0.5 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={SADAAT_LOGO_URL} 
                  alt="بین الاقوامی تنظیم السادات Logo" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-black text-white font-urdu text-lg leading-snug">
                  بین الاقوامی تنظیم السادات
                </h3>
                <p className="text-xs text-amber-300 font-bold font-urdu">مختلف کورسز کے لیے آن لائن رجسٹریشن</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-urdu leading-relaxed">
              خدمتِ خلق اور جدید تعلیم کا پلیٹ فارم۔ مختلف آن لائن کورسز کا آغاز 20 اگست 2026 سے ہو رہا ہے۔
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs font-urdu">
            <h4 className="text-sm font-bold text-amber-300 border-b border-slate-800 pb-1">
              اہم روابط (Quick Links)
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• مختلف کورسز آن لائن داخلہ فارم 2026</li>
              <li>• طالب علم پورٹل و تعلیمی پروگریس</li>
              <li>• ایڈمیشن کارڈ تصدیق و پرنٹ</li>
              <li>• مرکزی ایڈمن پورٹل (Admin Panel)</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 text-xs font-urdu">
            <h4 className="text-sm font-bold text-amber-300 border-b border-slate-800 pb-1">
              مرکزی رابطہ (Head Office)
            </h4>
            <div className="space-y-2 text-slate-300 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-urdu font-bold text-white text-sm">مرکزی دفتر: بین الاقوامی تنظیم السادات پورٹل</span>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:syedmuhammadamir@gmail.com" className="hover:text-amber-300 transition-colors">
                  syedmuhammadamir@gmail.com
                </a>
                <span className="text-slate-600">/</span>
                <a 
                  href="https://isoitportal.ai.studio" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-300 hover:underline font-mono text-xs"
                >
                  https://isoitportal.ai.studio
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-amber-200 font-bold">
                  <a href="tel:+923323475431" className="hover:text-white transition-colors">+923323475431</a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:+923008658360" className="hover:text-white transition-colors">+923008658360</a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:+923309899999" className="hover:text-white transition-colors">+923309899999</a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:+923298562895" className="hover:text-white transition-colors">+923298562895</a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-urdu gap-3">
          <div>
            © 2026 بین الاقوامی تنظیم السادات — مختلف کورسز آن لائن پورٹل۔ تمام حقوق محفوظ ہیں۔
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>SADAAT INTERNATIONAL SECURE PORTAL</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
