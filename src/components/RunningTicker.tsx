import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const RunningTicker: React.FC = () => {
  const tickerEnglish = "This portal is prepared by Syed Mohammad Aamir Naqvi, Chairman IT Support Council, International Syed Organization Pakistan";
  const tickerUrdu = "یہ پورٹل سید محمد عامر نقوی (چیئرمین آئی ٹی سپورٹ کونسل، بین الاقوامی تنظیم السادات پاکستان) نے تیار کیا ہے۔";

  return (
    <div className="bg-emerald-950 border-t-2 border-amber-400 text-amber-300 overflow-hidden py-2.5 px-4 shadow-2xl relative z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Fixed Badge */}
        <div className="bg-amber-400 text-emerald-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md font-urdu">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>سرکاری اطلاع / Credits</span>
        </div>

        {/* Marquee Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="inline-block whitespace-nowrap animate-marquee flex items-center gap-8">
            <span className="font-bold text-xs sm:text-sm tracking-wide font-sans text-white">
              {tickerEnglish}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 inline shrink-0" />
            <span className="font-bold text-xs sm:text-sm font-urdu text-amber-300">
              {tickerUrdu}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 inline shrink-0" />
            <span className="font-bold text-xs sm:text-sm tracking-wide font-sans text-white">
              {tickerEnglish}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 inline shrink-0" />
            <span className="font-bold text-xs sm:text-sm font-urdu text-amber-300">
              {tickerUrdu}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
