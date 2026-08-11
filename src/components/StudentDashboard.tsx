import React, { useState } from 'react';
import { StudentProgress, CourseModule } from '../types';
import { DEMO_STUDENT_PROGRESS } from '../data/mockData';
import { SADAAT_LOGO_URL } from '../assets/logo';
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  FileCheck, 
  Video, 
  HelpCircle, 
  Upload, 
  Sparkles,
  ChevronRight,
  BookOpen,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  lang: 'ur' | 'en';
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ lang }) => {
  const isUrdu = lang === 'ur';

  const [progressData, setProgressData] = useState<StudentProgress>(DEMO_STUDENT_PROGRESS);
  const [activeVideoModule, setActiveVideoModule] = useState<CourseModule | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<CourseModule | null>(null);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    if (quizAnswer === null || !activeQuizModule) return;
    setQuizSubmitted(true);

    setTimeout(() => {
      // Update module progress
      const updatedModules = progressData.modules.map(mod => {
        if (mod.id === activeQuizModule.id) {
          return {
            ...mod,
            quizCompleted: true,
            score: quizAnswer === 1 ? 90 : 75,
            completedLessons: mod.lessonsCount
          };
        }
        return mod;
      });

      // Recalculate percentage
      const totalLessons = updatedModules.reduce((acc, m) => acc + m.lessonsCount, 0);
      const completedLessons = updatedModules.reduce((acc, m) => acc + m.completedLessons, 0);
      const newPercentage = Math.round((completedLessons / totalLessons) * 100);

      setProgressData({
        ...progressData,
        modules: updatedModules,
        completionPercentage: newPercentage,
        certificateIssued: newPercentage >= 80,
      });
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 p-0.5 border-2 border-amber-400 shadow-lg overflow-hidden shrink-0">
              <img 
                src={SADAAT_LOGO_URL} 
                alt="بین الاقوامی تنظیم السادات Logo" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-950 font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>کورس آغاز: 20 اگست 2026 (Starts August 20, 2026)</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-urdu text-white">
                بین الاقوامی تنظیم السادات — طالب علم پورٹل
              </h1>

              <div className="text-amber-300 font-bold font-urdu text-sm">
                طالب علم: {progressData.studentName} (مختلف کورسز آن لائن پورٹل)
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-emerald-200 font-mono">
                <span>ROLL NO: <strong className="text-amber-300">{progressData.rollNumber}</strong></span>
                <span>•</span>
                <span>CNIC: {progressData.cnic}</span>
              </div>
            </div>
          </div>

          {/* Overall Progress Gauge */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center shrink-0 w-full md:w-auto">
            <span className="text-xs text-emerald-200 font-urdu block mb-1">کُل پیش رفت (Overall Progress)</span>
            <div className="text-4xl font-black font-mono text-amber-300">
              {progressData.completionPercentage}%
            </div>
            <div className="w-48 bg-emerald-950/60 h-2.5 rounded-full mt-2 overflow-hidden mx-auto">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressData.completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">ماڈیولز (Modules)</span>
            <span className="text-lg font-bold text-slate-900 font-mono">4 میں سے 2 مکمل</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">اسائنمنٹس (Assignments)</span>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {progressData.assignmentsSubmitted} / {progressData.totalAssignments}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">اوسط کوئز اسکور</span>
            <span className="text-lg font-bold text-slate-900 font-mono">91% (بہترین)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">سرٹیفکیٹ اسٹیٹس</span>
            <span className="text-xs font-bold text-emerald-800 font-urdu">
              {progressData.certificateIssued ? 'ایوارڈ جاری شدہ' : '80% پر دستیاب'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Course Modules List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold font-urdu text-emerald-950">
              ڈیجیٹل کورس 2026 کے تعلیمی ماڈیولز (Course Curriculum)
            </h2>
            <p className="text-xs text-slate-500 font-urdu mt-0.5">
              ہر ماڈیول میں ویڈیو لیکچرز، مطالعہ مواد اور خودکار کوئز شامل ہیں۔
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-mono">
            20 AUG 2026
          </span>
        </div>

        <div className="space-y-4">
          {progressData.modules.map((mod, index) => {
            const isComplete = mod.completedLessons === mod.lessonsCount;
            const pct = Math.round((mod.completedLessons / mod.lessonsCount) * 100);

            return (
              <div 
                key={mod.id}
                className={`p-5 rounded-2xl border transition-all ${
                  mod.isUnlocked 
                    ? 'bg-white border-slate-200 hover:border-emerald-600 shadow-2xs' 
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center font-mono">
                        0{index + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 font-urdu">
                        {isUrdu ? mod.titleUrdu : mod.titleEnglish}
                      </h3>
                      {isComplete && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-urdu flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> مکمل شدہ
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-urdu">
                      {isUrdu ? mod.descriptionUrdu : mod.descriptionEnglish}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {mod.duration}
                      </span>
                      <span>•</span>
                      <span>اسباق: {mod.completedLessons}/{mod.lessonsCount}</span>
                      {mod.quizCompleted && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">کوئز اسکور: {mod.score}%</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Progress Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                    <div className="w-full sm:w-32 space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>Progress</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setActiveVideoModule(mod)}
                        className="flex-1 sm:flex-initial bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3.5 py-2 rounded-xl text-xs font-urdu transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-700" />
                        <span>لیکچر دیکھیں</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveQuizModule(mod);
                          setQuizAnswer(null);
                          setQuizSubmitted(false);
                        }}
                        className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs font-urdu transition-colors flex items-center justify-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>کوئز دیں</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIDEO LECTURE MODAL */}
      {activeVideoModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden relative">
            <div className="bg-emerald-900 text-white p-4 px-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold font-urdu text-sm sm:text-base">
                  {activeVideoModule.titleUrdu}
                </h3>
              </div>
              <button 
                onClick={() => setActiveVideoModule(null)}
                className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Simulated Video Player Box */}
              <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden group shadow-lg border-2 border-emerald-800">
                <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center cursor-pointer shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl flex items-center justify-between text-xs text-emerald-200 font-mono">
                  <span>ISO DIGITAL LECTURE 2026 - STREAMING</span>
                  <span>45:00 / 45:00</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-urdu leading-relaxed">
                <strong>لیکچر کا خلاصہ:</strong> اس سبق میں اسلامی اخلاق، جوانوں کے لیے رہنمائی اور 20 اگست 2026 سے شروع ہونے والے تعلیمی منصوبے کے خطوط پر تفصیلی روشنی ڈالی گئی ہے۔
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuizModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold font-urdu">
                <HelpCircle className="w-5 h-5 text-emerald-700" />
                <span>خودکار آن لائن کوئز (Module Quiz)</span>
              </div>
              <button onClick={() => setActiveQuizModule(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {quizSubmitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold font-urdu text-emerald-950">
                  کوئز کامیابی کے ساتھ مکمل ہو گیا!
                </h4>
                <p className="text-xs text-slate-600 font-urdu">
                  آپ نے اس کوئز میں 90% حاصل کیے۔ آپ کا اسٹوڈنٹ پروگریس چارٹ اپڈیٹ ہو چکا ہے۔
                </p>
                <button
                  onClick={() => setActiveQuizModule(null)}
                  className="bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs font-urdu"
                >
                  ڈیش بورڈ پر واپس جائیں
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-bold block mb-1">سوال #1</span>
                  <p className="text-sm font-bold text-emerald-950 font-urdu">
                    اسلامی فکر میں جوانوں کے بنیادی اخلاقی اور تنظیمی فریضے کا محور کیا ہے؟
                  </p>
                </div>

                <div className="space-y-2 text-xs font-urdu">
                  {[
                    'خود سازی، خدمت خلق اور دینی شعور میں اضافہ',
                    'صرف ذاتی تعلیمی مشاغل',
                    'غیر متعلقہ کاموں میں وقت ضائع کرنا'
                  ].map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => setQuizAnswer(i)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        quizAnswer === i 
                          ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}. {opt}
                    </div>
                  ))}
                </div>

                <button
                  disabled={quizAnswer === null}
                  onClick={handleQuizSubmit}
                  className={`w-full py-3 rounded-xl font-bold text-xs font-urdu transition-colors ${
                    quizAnswer !== null 
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  جواب جمع کروائیں
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
