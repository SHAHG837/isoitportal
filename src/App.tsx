import React, { useState } from 'react';
import { Applicant, EmailNotification } from './types';
import { INITIAL_APPLICANTS, INITIAL_EMAIL_NOTIFICATIONS, COURSES_LIST, DIVISIONS_LIST } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroBanner } from './components/HeroBanner';
import { AdmissionForm } from './components/AdmissionForm';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AdmissionCardModal } from './components/AdmissionCardModal';
import { TrackModal } from './components/TrackModal';
import { AdmissionCard } from './components/AdmissionCard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { RunningTicker } from './components/RunningTicker';
import { FileText, Award, ShieldCheck, Search, Sparkles } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'ur' | 'en'>('ur');
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Dynamic Course & Division State
  const [availableCourses, setAvailableCourses] = useState<string[]>(COURSES_LIST);
  const [availableDivisions, setAvailableDivisions] = useState<string[]>(DIVISIONS_LIST);

  // Application & Email Notification States with LocalStorage Persistence
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem('sadaat_applicants_2026');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_APPLICANTS;
  });

  const [notifications, setNotifications] = useState<EmailNotification[]>(() => {
    try {
      const saved = localStorage.getItem('sadaat_notifications_2026');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMAIL_NOTIFICATIONS;
  });

  // Admin Authentication State (ID: admin, Password: admin123)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Student Authentication State
  const [isStudentLoginModalOpen, setIsStudentLoginModalOpen] = useState<boolean>(false);

  // Modals
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [selectedCardApplicant, setSelectedCardApplicant] = useState<Applicant | null>(null);

  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // Add new applicant handler
  const handleAddApplicant = (newApplicant: Applicant) => {
    setApplicants(prev => {
      const updated = [newApplicant, ...prev];
      try {
        localStorage.setItem('sadaat_applicants_2026', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Update applicants handler (from admin panel)
  const handleUpdateApplicants = (updated: Applicant[]) => {
    setApplicants(updated);
    try {
      localStorage.setItem('sadaat_applicants_2026', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Update applicant selected course
  const handleUpdateApplicantCourse = (applicantId: string, newCourse: string) => {
    setApplicants(prev => {
      const updated = prev.map(app => 
        app.id === applicantId ? { ...app, selectedCourse: newCourse, updatedAt: new Date().toISOString() } : app
      );
      try {
        localStorage.setItem('sadaat_applicants_2026', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Add new notifications handler
  const handleAddNotifications = (newNotifs: EmailNotification[]) => {
    setNotifications(prev => {
      const updated = [...newNotifs, ...prev];
      try {
        localStorage.setItem('sadaat_notifications_2026', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Open Admission Card Modal
  const handleOpenCardModal = (applicant: Applicant) => {
    setSelectedCardApplicant(applicant);
    setIsCardModalOpen(true);
  };

  // Handle Tab Switch with Admin Authentication Check
  const handleTabChange = (tab: string) => {
    if (tab === 'admin' && !isAdminLoggedIn) {
      setIsAdminLoginModalOpen(true);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col font-sans pb-12 ${lang === 'ur' ? 'font-urdu' : ''}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        lang={lang}
        setLang={setLang}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAdminLoginModal={() => setIsAdminLoginModalOpen(true)}
        onOpenStudentLoginModal={() => setIsStudentLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <HeroBanner
            onApply={() => setCurrentTab('apply')}
            onDashboard={() => setCurrentTab('dashboard')}
            onTrack={() => setIsTrackModalOpen(true)}
            lang={lang}
          />
        )}

        {currentTab === 'apply' && (
          <AdmissionForm
            onAddApplicant={handleAddApplicant}
            onOpenCardModal={handleOpenCardModal}
            availableCourses={availableCourses}
            availableDivisions={availableDivisions}
            lang={lang}
          />
        )}

        {currentTab === 'dashboard' && (
          <StudentDashboard lang={lang} />
        )}

        {currentTab === 'card-preview' && (
          <div className="space-y-8 max-w-4xl mx-auto py-6">
            <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg border-b-4 border-amber-400 text-center space-y-2">
              <h1 className="text-2xl font-bold font-urdu">
                ایڈمیشن کارڈ کا براہِ راست پیش نظارہ و ڈاؤن لوڈ
              </h1>
              <p className="text-xs text-emerald-200 font-urdu">
                درخواست فارم مکمل ہونے کی صورت میں یہاں سے اپنے ایڈمیشن کارڈ کی تصدیق کریں اور پرنٹ لیں۔
              </p>
            </div>

            {(() => {
              const approvedCandidate = (applicants || []).find(a => a.status === 'approved' && a.isFullyCompleted);
              if (!approvedCandidate) {
                return (
                  <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center font-urdu text-slate-600">
                    کوئی منظور شدہ ایڈمیشن کارڈ دستیاب نہیں ہے۔ آن لائن داخلہ فارم پر کریں۔
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleOpenCardModal(approvedCandidate)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs font-urdu shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span>تصدیقی مراحل کھولیں (Open Validation & Print Dialog)</span>
                    </button>
                  </div>
                  <AdmissionCard 
                    applicant={approvedCandidate} 
                    isUrdu={lang === 'ur'} 
                  />
                </div>
              );
            })()}
          </div>
        )}

        {currentTab === 'admin' && (
          isAdminLoggedIn ? (
            <AdminPanel
              applicants={applicants}
              notifications={notifications}
              availableCourses={availableCourses}
              availableDivisions={availableDivisions}
              onUpdateApplicants={handleUpdateApplicants}
              onAddNotifications={handleAddNotifications}
              onUpdateCourses={setAvailableCourses}
              onUpdateDivisions={setAvailableDivisions}
              onOpenCardModal={handleOpenCardModal}
              onAdminLogout={() => {
                setIsAdminLoggedIn(false);
                setCurrentTab('home');
              }}
              lang={lang}
            />
          ) : (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4 font-urdu">
                <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">ایڈمن رسائی کے لیے لاگ ان درکار ہے</h2>
                <p className="text-xs text-slate-600">
                  براہِ کرم پاسورڈ درج کر کے ایڈمن کنٹرول پینل تک رسائی حاصل کریں۔
                </p>
                <button
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="w-full bg-emerald-800 text-white font-bold py-3 rounded-xl hover:bg-emerald-900 text-sm"
                >
                  ایڈمن لاگ ان فارم کھولیں
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer lang={lang} />

      {/* Running Bottom Credit Ticker */}
      <RunningTicker />

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminLoginModalOpen(false);
          setCurrentTab('admin');
        }}
      />

      <StudentLoginModal
        isOpen={isStudentLoginModalOpen}
        onClose={() => setIsStudentLoginModalOpen(false)}
        applicants={applicants}
        availableCourses={availableCourses}
        onUpdateApplicantCourse={handleUpdateApplicantCourse}
        onOpenCardModal={handleOpenCardModal}
        onGoToApply={() => setCurrentTab('apply')}
        lang={lang}
      />

      <AdmissionCardModal
        applicant={selectedCardApplicant}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        isUrdu={lang === 'ur'}
      />

      <TrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        applicants={applicants}
        onOpenCardModal={handleOpenCardModal}
        lang={lang}
      />
    </div>
  );
}
