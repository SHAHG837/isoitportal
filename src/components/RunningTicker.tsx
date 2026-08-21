import React from 'react';
import { Sparkles, ShieldCheck, PhoneCall } from 'lucide-react';

export const RunningTicker: React.FC = () => {
  const tickerUrdu = "یہ پورٹل سید محمد عامر نقوی (چیئرمین آئی ٹی سپورٹ کونسل، بین الاقوامی تنظیم السادات پاکستان) نے تیار کیا ہے۔";
  const tickerEnglish = "This portal is prepared by Syed Mohammad Aamir Naqvi, Chairman IT Support Council, International Sadaat Organization Pakistan";
  const contactNo = "03323475431";

  // Reusable Pair of Urdu + English with Contact info
  const TickerPair = () => (
    <div className="inline-flex items-center gap-8 shrink-0 pr-8">
      {/* 1. Urdu Ticker Segment */}
      <div className="inline-flex items-center gap-2.5 whitespace-nowrap" dir="rtl">
        <span className="font-bold text-xs sm:text-sm font-urdu text-amber-300 tracking-wide">
          {tickerUrdu}
        </span>
        <span className="inline-flex items-center gap-1 bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-mono text-xs font-black shadow-sm shrink-0">
          <PhoneCall className="w-3 h-3 shrink-0" />
          <span>رابطہ: {contactNo}</span>
        </span>
      </div>

      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />

      {/* 2. English Ticker Segment (starts immediately after Urdu) */}
      <div className="inline-flex items-center gap-2.5 whitespace-nowrap" dir="ltr">
        <span className="font-semibold text-xs sm:text-sm font-sans text-white tracking-wide">
          {tickerEnglish}
        </span>
        <span className="inline-flex items-center gap-1 bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border border-amber-400/50 shadow-sm shrink-0">
          <PhoneCall className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Contact: {contactNo}</span>
        </span>
      </div>

      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
    </div>
  );

  return (
    <div className="bg-emerald-950 border-t-2 border-amber-400 text-amber-300 overflow-hidden py-2 px-3 shadow-2xl relative z-40 select-none">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Fixed Header Badge */}
        <div className="bg-amber-400 text-emerald-950 font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md font-urdu">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-950 shrink-0" />
          <span className="whitespace-nowrap">سرکاری اطلاع / Credits</span>
        </div>

        {/* Continuous Seamless Infinite Ticker: Runs Urdu then English then Urdu in an unbroken stream */}
        <div className="flex-1 overflow-hidden relative" dir="ltr">
          <div className="animate-marquee-continuous inline-flex items-center">
            {/* Primary Track */}
            <div className="inline-flex items-center shrink-0">
              <TickerPair />
              <TickerPair />
            </div>
            {/* Clone Track (Seamlessly continues when Track 1 reaches end, producing infinite zero-gap loop) */}
            <div className="inline-flex items-center shrink-0" aria-hidden="true">
              <TickerPair />
              <TickerPair />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
