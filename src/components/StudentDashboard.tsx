import React, { useState } from 'react';
import { StudentProgress, CourseModule, Applicant } from '../types';
import { DEMO_STUDENT_PROGRESS, COURSES_LIST } from '../data/mockData';
import { SADAAT_LOGO_URL } from '../assets/logo';
import { getQuizModulesForCourse, CourseQuizModule } from '../data/quizzes';
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  Clock, 
  Award, 
  FileCheck, 
  Video, 
  HelpCircle, 
  BookOpen, 
  Calendar, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

interface StudentDashboardProps {
  lang: 'ur' | 'en';
  applicants?: Applicant[];
  availableCourses?: string[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  lang,
  applicants = [],
  availableCourses = COURSES_LIST
}) => {
  const isUrdu = lang === 'ur';

  // Selected Course for Dashboard View
  const [selectedCourseName, setSelectedCourseName] = useState<string>(availableCourses[0] || 'بنیادی کمپیوٹر کورس (Basic Computer Course)');

  // Dynamic Course Quiz Modules based on selected course
  const activeCourseQuizModules = getQuizModulesForCourse(selectedCourseName);

  // Student progress state
  const [progressData, setProgressData] = useState<StudentProgress>(DEMO_STUDENT_PROGRESS);

  // Completed Quizzes Tracker (Module ID -> { score: number, completed: boolean })
  const [quizScores, setQuizScores] = useState<Record<string, { score: number; completed: boolean }>>({
    'bcc-mod-1': { score: 90, completed: true }
  });

  // Active Modals
  const [activeVideoModule, setActiveVideoModule] = useState<CourseQuizModule | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<CourseQuizModule | null>(null);

  // Quiz Modal Multi-Question State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [finalScorePercentage, setFinalScorePercentage] = useState(0);

  // Handle Opening Quiz Modal
  const handleOpenQuizModal = (mod: CourseQuizModule) => {
    setActiveQuizModule(mod);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setFinalScorePercentage(0);
  };

  // Handle Submitting Quiz
  const handleCalculateAndSubmitQuiz = () => {
    if (!activeQuizModule) return;

    let correctCount = 0;
    activeQuizModule.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const totalQuestions = activeQuizModule.questions.length;
    const scorePct = Math.round((correctCount / totalQuestions) * 100);

    setFinalScorePercentage(scorePct);
    setQuizSubmitted(true);

    // Save quiz result
    setQuizScores(prev => ({
      ...prev,
      [activeQuizModule.id]: { score: scorePct, completed: true }
    }));
  };

  // Calculate Overall Completion
  const totalModulesCount = activeCourseQuizModules.length;
  const completedQuizCount = activeCourseQuizModules.filter(m => quizScores[m.id]?.completed).length;
  const overallCompletionPercentage = totalModulesCount > 0 
    ? Math.round((completedQuizCount / totalModulesCount) * 100) 
    : 0;

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
                <span>کورس سیشن آغاز: 20 اگست 2026 (Starts August 20, 2026)</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black font-urdu text-white">
                بین الاقوامی تنظیم السادات — طالب علم ایل ایم ایس پورٹل
              </h1>

              <div className="text-amber-300 font-bold font-urdu text-sm">
                طالب علم: {progressData.studentName} — آن لائن لائیو کلاسز و کوئز
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
            <span className="text-xs text-emerald-200 font-urdu block mb-1">کورس کوئز پیش رفت (Course Progress)</span>
            <div className="text-4xl font-black font-mono text-amber-300">
              {overallCompletionPercentage}%
            </div>
            <div className="w-48 bg-emerald-950/60 h-2.5 rounded-full mt-2 overflow-hidden mx-auto">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${overallCompletionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Selection Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold font-urdu text-emerald-950 text-sm">
            <Filter className="w-4 h-4 text-emerald-700" />
            <span>منتخب کردہ کورس کا انتخاب کریں (Select Course for LMS & Quizzes):</span>
          </div>

          <select
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-emerald-700 text-xs font-bold font-urdu bg-emerald-50 text-emerald-950 focus:outline-none shadow-xs"
          >
            {availableCourses.map((crs, i) => (
              <option key={i} value={crs}>
                {crs}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">ماڈیولز (Course Modules)</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {activeCourseQuizModules.length} ماڈیولز فعال ہیں
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">مکمل شدہ کوئزز</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {completedQuizCount} / {totalModulesCount} کوئز
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">کورس گریڈ و اسکور</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {overallCompletionPercentage > 0 ? `${overallCompletionPercentage}% (پاس)` : 'زیرِ تعلیم'}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-urdu block">کورس سرٹیفکیٹ</span>
            <span className="text-xs font-bold text-emerald-800 font-urdu">
              {overallCompletionPercentage >= 75 ? 'ایوارڈ کے لیے اہل' : '75% کوئز پاس کرنے پر'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Course Modules & Quizzes List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold font-urdu text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{selectedCourseName} — تعلیمی ماڈیولز و کوئزز</span>
            </h2>
            <p className="text-xs text-slate-500 font-urdu mt-0.5">
              ہر ماڈیول کے لیے مخصوص ویڈیو لیکچر اور خودکار آن لائن کوئز کا نظام شامل ہے۔
            </p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full font-mono shrink-0">
            20 AUG 2026 SESSION
          </span>
        </div>

        <div className="space-y-4">
          {activeCourseQuizModules.map((mod, index) => {
            const quizState = quizScores[mod.id];
            const isQuizDone = quizState?.completed;

            return (
              <div 
                key={mod.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 shadow-2xs transition-all space-y-3"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center font-mono">
                        0{index + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 font-urdu">
                        {isUrdu ? mod.moduleTitleUrdu : mod.moduleTitleEnglish}
                      </h3>
                      {isQuizDone && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full font-urdu flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> کوئز پاس ({quizState.score}%)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                        سوالات: {mod.questions.length} ایم سی کیوز
                      </span>
                      <span>•</span>
                      <span>آن لائن ٹیسٹ سیشن 2026</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => setActiveVideoModule(mod)}
                      className="flex-1 sm:flex-initial bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs font-urdu transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
                    >
                      <Video className="w-4 h-4 text-emerald-700" />
                      <span>لیکچر دیکھیں</span>
                    </button>

                    <button
                      onClick={() => handleOpenQuizModal(mod)}
                      className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs font-urdu transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{isQuizDone ? 'کوئز دوبارہ دیں' : 'آن لائن کوئز دیں'}</span>
                    </button>
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
                  {activeVideoModule.moduleTitleUrdu}
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
                  <span>ISO DIGITAL LMS — {selectedCourseName.toUpperCase()}</span>
                  <span>45:00 LIVE</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-urdu leading-relaxed">
                <strong>کورس ماڈیول ویڈیو لیکچر:</strong> بین الاقوامی تنظیم السادات آن لائن پورٹل پر اس ماڈیول کا مکمل عملی تعلیمی مواد فراہم کر دیا گیا ہے۔ براہ کرم ویڈیو لیکچر مکمل دیکھ کر آن لائن کوئز حل کریں۔
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuizModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-emerald-800 w-full max-w-xl p-6 space-y-6 relative my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-950 font-bold font-urdu text-base">
                <HelpCircle className="w-5 h-5 text-emerald-700" />
                <span>آن لائن کورس کوئز: {activeQuizModule.moduleTitleUrdu}</span>
              </div>
              <button onClick={() => setActiveQuizModule(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quizSubmitted ? (
              /* Quiz Result Screen */
              <div className="text-center space-y-4 py-4 font-urdu">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  finalScorePercentage >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h4 className="text-xl font-black text-emerald-950">
                  {finalScorePercentage >= 70 ? 'مبارک ہو! آپ کا کوئز پاس ہو گیا!' : 'کوئز کی کوشش مکمل ہو گئی'}
                </h4>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-xs mx-auto space-y-1">
                  <span className="text-xs text-slate-600 block">حاصل کردہ مارکس و فی صد:</span>
                  <span className="text-3xl font-mono font-black text-emerald-900">{finalScorePercentage}%</span>
                </div>

                {/* Question Review & Explanations */}
                <div className="text-right text-xs space-y-3 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  <h5 className="font-bold text-slate-800 border-b pb-1">سوالات اور درست جوابات کی وضاحت:</h5>
                  {activeQuizModule.questions.map((q, idx) => {
                    const userAns = selectedAnswers[idx];
                    const isCorrect = userAns === q.correctOptionIndex;

                    return (
                      <div key={q.id} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-bold">
                          <span>سوال {idx + 1}: {q.questionUrdu}</span>
                          <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                            {isCorrect ? '✓ درست' : '✗ غلط'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          <strong>درست جواب:</strong> {q.optionsUrdu[q.correctOptionIndex]}
                        </p>
                        <p className="text-[11px] text-emerald-800 italic bg-emerald-50/80 p-1.5 rounded-lg">
                          💡 {q.explanationUrdu}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setActiveQuizModule(null)}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors"
                >
                  ڈیش بورڈ پر واپس جائیں
                </button>
              </div>
            ) : (
              /* Question Stepper View */
              <div className="space-y-5 font-urdu">
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-b pb-2">
                  <span>سوال {currentQuestionIndex + 1} از {activeQuizModule.questions.length}</span>
                  <span className="font-mono text-emerald-700">
                    {Math.round(((currentQuestionIndex + 1) / activeQuizModule.questions.length) * 100)}%
                  </span>
                </div>

                {/* Question Box */}
                {(() => {
                  const q = activeQuizModule.questions[currentQuestionIndex];
                  if (!q) return null;

                  return (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200">
                        <span className="text-xs text-emerald-800 font-bold block mb-1">سوال #{currentQuestionIndex + 1}</span>
                        <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed">
                          {q.questionUrdu}
                        </p>
                        <p className="text-xs font-mono text-emerald-800/80 mt-1">
                          {q.questionEnglish}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {q.optionsUrdu.map((opt, i) => {
                          const isSelected = selectedAnswers[currentQuestionIndex] === i;
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: i }));
                              }}
                              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-bold ${
                                isSelected 
                                  ? 'bg-emerald-100 border-emerald-700 text-emerald-950 shadow-xs' 
                                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              <span>{i + 1}. {opt}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <button
                          disabled={currentQuestionIndex === 0}
                          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
                            currentQuestionIndex === 0 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>پچھلا سوال</span>
                        </button>

                        {currentQuestionIndex < activeQuizModule.questions.length - 1 ? (
                          <button
                            disabled={selectedAnswers[currentQuestionIndex] === undefined}
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
                              selectedAnswers[currentQuestionIndex] !== undefined
                                ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <span>اگلا سوال</span>
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            disabled={Object.keys(selectedAnswers).length < activeQuizModule.questions.length}
                            onClick={handleCalculateAndSubmitQuiz}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md ${
                              Object.keys(selectedAnswers).length >= activeQuizModule.questions.length
                                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <span>کوئز جمع کروائیں</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
