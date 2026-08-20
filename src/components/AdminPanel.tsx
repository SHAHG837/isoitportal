import React, { useState } from 'react';
import { Applicant, EmailNotification, ApplicationStatus } from '../types';
import { createNotification } from '../utils/security';
import { exportToCSV, exportToWord, exportToPDFReport } from '../utils/export';
import { AdmissionCard } from './AdmissionCard';
import { SADAAT_LOGO_URL } from '../assets/logo';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Printer, 
  Mail, 
  UserX, 
  Image as ImageIcon, 
  CheckSquare, 
  Square, 
  MessageSquare, 
  FileText, 
  Download, 
  ChevronRight, 
  User, 
  Eye, 
  X,
  AlertCircle,
  Building,
  Sparkles,
  Inbox,
  BookOpen,
  Settings,
  Trash2,
  Edit,
  Plus,
  FileSpreadsheet,
  FileCode,
  MapPin,
  Save,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface AdminPanelProps {
  applicants: Applicant[];
  notifications: EmailNotification[];
  availableCourses: string[];
  availableDivisions: string[];
  onUpdateApplicants: (updated: Applicant[]) => void;
  onAddNotifications: (newNotifs: EmailNotification[]) => void;
  onUpdateCourses: (courses: string[]) => void;
  onUpdateDivisions: (divisions: string[]) => void;
  onOpenCardModal: (applicant: Applicant) => void;
  onAdminLogout?: () => void;
  lang: 'ur' | 'en';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  applicants,
  notifications,
  availableCourses,
  availableDivisions,
  onUpdateApplicants,
  onAddNotifications,
  onUpdateCourses,
  onUpdateDivisions,
  onOpenCardModal,
  onAdminLogout,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  // Active Tab: 'applications' | 'emails' | 'settings'
  const [activeTab, setActiveTab] = useState<'applications' | 'emails' | 'settings'>('applications');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');

  // Multi-Selection State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals State
  const [bulkNoteModalOpen, setBulkNoteModalOpen] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<ApplicationStatus>('approved');
  const [bulkNoteText, setBulkNoteText] = useState('');

  const [bulkCardsModalOpen, setBulkCardsModalOpen] = useState(false);
  const [selectedDetailApplicant, setSelectedDetailApplicant] = useState<Applicant | null>(null);

  // Single Edit Applicant Modal State
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);

  // Course / City Settings Manager Inputs
  const [newCourseInput, setNewCourseInput] = useState('');
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
  const [editCourseText, setEditCourseText] = useState('');

  const [newDivisionInput, setNewDivisionInput] = useState('');
  const [editingDivisionIndex, setEditingDivisionIndex] = useState<number | null>(null);
  const [editDivisionText, setEditDivisionText] = useState('');

  // Live SMTP / Gmail App Password Management State
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [isSmtpConfigured, setIsSmtpConfigured] = useState(false);
  const [smtpStatusMsg, setSmtpStatusMsg] = useState('');
  const [testTargetEmail, setTestTargetEmail] = useState('syedmuhammadamir837@gmail.com');
  const [testResultMsg, setTestResultMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState('');

  const handleLiveRefresh = async () => {
    setIsRefreshing(true);
    setRefreshNotice('');
    try {
      const res = await fetch('/api/applicants');
      const data = await res.json();
      if (res.ok && data?.success && Array.isArray(data.applicants)) {
        onUpdateApplicants(data.applicants);
        setRefreshNotice(`تازہ ترین ڈیٹا کامیابی سے ریفریش ہو گیا! کُل داخلے: ${data.applicants.length}`);
        setTimeout(() => setRefreshNotice(''), 4000);
      }
    } catch (err: any) {
      console.error('Failed to refresh data from backend:', err);
      setRefreshNotice('ریفریش کرنے میں ناکامی پیش آئی۔');
      setTimeout(() => setRefreshNotice(''), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'emails') {
      fetch('/api/smtp-config')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.success) {
            setIsSmtpConfigured(Boolean(data.isConfigured));
          }
        })
        .catch(err => console.warn('SMTP fetch error:', err));
    }
  }, [activeTab]);

  const handleSaveSmtpPassword = async () => {
    setSmtpStatusMsg('');
    try {
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: 'syedmuhammadamir837@gmail.com',
          gmailAppPassword: gmailAppPassword
        })
      });
      const data = await res.json();
      if (data?.success) {
        setIsSmtpConfigured(Boolean(data.isConfigured));
        setSmtpStatusMsg('گوگل ایپ پاس ورڈ کامیابی سے محفوظ ہو گیا!');
        setTimeout(() => setSmtpStatusMsg(''), 4000);
      } else {
        setSmtpStatusMsg(data?.error || 'محفوظ کرنے میں ناکامی۔');
      }
    } catch (err: any) {
      setSmtpStatusMsg(err?.message || 'خرابی پیش آئی۔');
    }
  };

  const handleSendTestEmail = async () => {
    setIsTestingEmail(true);
    setTestResultMsg(null);
    try {
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: testTargetEmail })
      });
      const data = await res.json();
      if (data?.success) {
        setTestResultMsg({
          success: true,
          text: `کامیابی! لائیو ای میل ${testTargetEmail} پر کامیابی سے پہنچ گئی ہے۔ (ID: ${data.messageId || 'ACCEPTED'})`
        });
      } else {
        setTestResultMsg({
          success: false,
          text: `ای میل ارسال ناکام: ${data?.error || 'ایپ پاس ورڈ غیر صحیح ہے'}`
        });
      }
    } catch (err: any) {
      setTestResultMsg({
        success: false,
        text: `ارسال کرنے میں نیٹ ورک خرابی: ${err?.message}`
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Filtered applicants
  const filteredApplicants = applicants.filter(app => {
    const rawTerm = searchTerm.toLowerCase().trim();
    const digitsOnly = rawTerm.replace(/\D/g, '');

    const cleanCnic = (app.cnic || '').toLowerCase().replace(/\D/g, '');
    const cleanPhone = (app.phone || '').toLowerCase().replace(/\D/g, '');

    let matchesSearch = false;
    if (!rawTerm) {
      matchesSearch = true;
    } else {
      const matchText = 
        app.fullName.toLowerCase().includes(rawTerm) ||
        app.trackingNumber.toLowerCase().includes(rawTerm) ||
        (app.rollNumber && app.rollNumber.toLowerCase().includes(rawTerm)) ||
        app.email.toLowerCase().includes(rawTerm) ||
        app.division.toLowerCase().includes(rawTerm) ||
        (app.selectedCourse && app.selectedCourse.toLowerCase().includes(rawTerm));

      const matchDigits = digitsOnly.length >= 3 && (cleanCnic.includes(digitsOnly) || cleanPhone.includes(digitsOnly));

      matchesSearch = matchText || matchDigits;
    }

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Toggle selection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApplicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplicants.map(a => a.id));
    }
  };

  // Bulk Status Update
  const handleExecuteBulkStatus = () => {
    if (selectedIds.length === 0) return;

    const newNotifications: EmailNotification[] = [];

    const updated = applicants.map(app => {
      if (selectedIds.includes(app.id)) {
        const rollNo = app.rollNumber || `SADAAT-2026-RN-${Math.floor(100 + Math.random() * 900)}`;
        const updatedApp: Applicant = {
          ...app,
          status: bulkTargetStatus,
          rollNumber: bulkTargetStatus === 'approved' ? rollNo : app.rollNumber,
          adminNote: bulkNoteText || (bulkTargetStatus === 'approved' ? 'درخواست منظور کر لی گئی ہے۔' : 'درخواست فی الحال رد کر دی گئی ہے۔'),
          updatedAt: new Date().toISOString(),
        };

        const notif = createNotification(
          updatedApp,
          bulkTargetStatus === 'approved' ? 'status_approved' : 'status_rejected',
          bulkNoteText
        );
        newNotifications.push(notif);

        return updatedApp;
      }
      return app;
    });

    onUpdateApplicants(updated);
    onAddNotifications(newNotifications);

    setBulkNoteModalOpen(false);
    setBulkNoteText('');
    setSelectedIds([]);
  };

  // Bulk Delete Applicants
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`کیا آپ واقعی ${selectedIds.length} منتخب شدہ درخواستیں ڈیلیٹ کرنا چاہتے ہیں؟`)) {
      const updated = applicants.filter(app => !selectedIds.includes(app.id));
      onUpdateApplicants(updated);
      setSelectedIds([]);
    }
  };

  // Single Delete Applicant
  const handleSingleDelete = (id: string) => {
    if (window.confirm('کیا آپ واقعی یہ طالب علم فارم ڈیلیٹ کرنا چاہتے ہیں؟')) {
      onUpdateApplicants(applicants.filter(app => app.id !== id));
      if (selectedDetailApplicant?.id === id) setSelectedDetailApplicant(null);
    }
  };

  // Single Edit Applicant Save
  const handleSaveApplicantEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplicant) return;

    const updated = applicants.map(app => 
      app.id === editingApplicant.id ? editingApplicant : app
    );
    onUpdateApplicants(updated);
    setEditingApplicant(null);
  };

  // Course Add/Edit/Delete Handlers
  const handleAddCourse = () => {
    if (!newCourseInput.trim()) return;
    if (availableCourses.includes(newCourseInput.trim())) return;
    onUpdateCourses([...availableCourses, newCourseInput.trim()]);
    setNewCourseInput('');
  };

  const handleSaveCourseEdit = (index: number) => {
    if (!editCourseText.trim()) return;
    const updated = [...availableCourses];
    updated[index] = editCourseText.trim();
    onUpdateCourses(updated);
    setEditingCourseIndex(null);
    setEditCourseText('');
  };

  const handleDeleteCourse = (index: number) => {
    if (availableCourses.length <= 1) {
      alert('کم از کم ایک کورس موجود رہنا ضروری ہے!');
      return;
    }
    if (window.confirm(`کیا آپ واقعی "${availableCourses[index]}" کورس فہرست سے ختم کرنا چاہتے ہیں؟`)) {
      const updated = availableCourses.filter((_, i) => i !== index);
      onUpdateCourses(updated);
    }
  };

  // City/Division Add/Edit/Delete Handlers
  const handleAddDivision = () => {
    if (!newDivisionInput.trim()) return;
    if (availableDivisions.includes(newDivisionInput.trim())) return;
    onUpdateDivisions([...availableDivisions, newDivisionInput.trim()]);
    setNewDivisionInput('');
  };

  const handleSaveDivisionEdit = (index: number) => {
    if (!editDivisionText.trim()) return;
    const updated = [...availableDivisions];
    updated[index] = editDivisionText.trim();
    onUpdateDivisions(updated);
    setEditingDivisionIndex(null);
    setEditDivisionText('');
  };

  const handleDeleteDivision = (index: number) => {
    if (availableDivisions.length <= 1) {
      alert('کم از کم ایک شہر/ڈویژن موجود رہنا ضروری ہے!');
      return;
    }
    if (window.confirm(`کیا آپ واقعی "${availableDivisions[index]}" شہر ختم کرنا چاہتے ہیں؟`)) {
      const updated = availableDivisions.filter((_, i) => i !== index);
      onUpdateDivisions(updated);
    }
  };

  // Selected applicants for bulk printing cards
  const selectedApplicantsForCards = applicants.filter(a => selectedIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border-b-4 border-amber-400">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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
              <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold text-xs px-3 py-0.5 rounded-full uppercase tracking-wider font-urdu">
                <ShieldCheck className="w-4 h-4 text-emerald-900" />
                <span>بین الاقوامی تنظیم السادات — مرکزی ایڈمن پورٹل</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-urdu text-white">
                درخواستوں و کورسز کا انتظامی کنٹرول پینل
              </h1>
              <p className="text-xs sm:text-sm text-amber-300 font-urdu max-w-xl">
                مختلف کورسز آن لائن رجسٹریشن کی منظوری/نامنظوری، بلک ایڈمیشن کارڈز کے پرنٹ، ڈیٹا ایکسپورٹ اور تدوین پورٹل۔
              </p>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            {onAdminLogout && (
              <button
                onClick={onAdminLogout}
                className="bg-rose-600/90 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs font-urdu shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>ایڈمن لاگ آؤٹ (Logout)</span>
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-300 font-urdu block">کُل درخواستیں</span>
                <span className="text-lg font-bold font-mono text-white">{applicants.length}</span>
              </div>

              <div className="bg-emerald-500/20 backdrop-blur-md p-2.5 rounded-xl border border-emerald-400/30 text-center">
                <span className="text-[10px] text-emerald-200 font-urdu block">منظور شدہ</span>
                <span className="text-lg font-bold font-mono text-emerald-300">
                  {applicants.filter(a => a.status === 'approved').length}
                </span>
              </div>

              <div className="bg-amber-500/20 backdrop-blur-md p-2.5 rounded-xl border border-amber-400/30 text-center">
                <span className="text-[10px] text-amber-200 font-urdu block">زیرِ جائزہ</span>
                <span className="text-lg font-bold font-mono text-amber-300">
                  {applicants.filter(a => a.status === 'pending').length}
                </span>
              </div>

              <div className="bg-rose-500/20 backdrop-blur-md p-2.5 rounded-xl border border-rose-400/30 text-center">
                <span className="text-[10px] text-rose-200 font-urdu block">ایکٹو کورسز</span>
                <span className="text-lg font-bold font-mono text-amber-300">
                  {availableCourses.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Applications vs Emails vs Settings) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-urdu transition-all cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>داخلہ درخواستیں (Applications - {applicants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-urdu transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>کورسز و شہر مینجمنٹ (Settings)</span>
          </button>

          <button
            onClick={() => setActiveTab('emails')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm font-urdu transition-all cursor-pointer ${
              activeTab === 'emails'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>ای میل لاگز (Logs)</span>
          </button>
        </div>

        {/* DATA EXPORT BUTTONS (CSV, PDF Report, Word) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(applicants)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-urdu px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="ایکسل شیت ڈاؤن لوڈ کریں"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={() => exportToPDFReport(applicants)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold font-urdu px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="پی ڈی ایف رپورٹ پرنٹ/ڈاؤن لوڈ کریں"
          >
            <Printer className="w-4 h-4" />
            <span>PDF رپورٹ</span>
          </button>

          <button
            onClick={() => exportToWord(applicants)}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold font-urdu px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="ورڈ ڈاکومنٹ ڈاؤن لوڈ کریں"
          >
            <FileCode className="w-4 h-4 text-amber-300" />
            <span>Word Doc</span>
          </button>
        </div>
      </div>

      {/* APPLICATIONS TAB CONTENT */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Search, Filters, Bulk Actions */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Field */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isUrdu ? 'نام، کورس، ٹریکنگ آئی ڈی، شناختی کارڈ یا ڈویژن سے تلاش کریں...' : 'Search by Name, Course, Tracking ID, CNIC...'}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Status Filter Buttons and Live Refresh Button */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs no-scrollbar">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold font-urdu whitespace-nowrap capitalize transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' && 'تمام (All)'}
                    {st === 'pending' && 'زیرِ جائزہ (Pending)'}
                    {st === 'approved' && 'منظور شدہ (Approved)'}
                    {st === 'rejected' && 'نامنظور شدہ (Rejected)'}
                  </button>
                ))}

                <button
                  onClick={handleLiveRefresh}
                  disabled={isRefreshing}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-urdu shadow-xs transition-colors cursor-pointer whitespace-nowrap ml-1"
                  title="سرور فائل سے لائیو ڈیٹا ریفریش کریں"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>{isRefreshing ? 'ریفریش ہو رہا ہے...' : 'لائیو ریفریش'}</span>
                </button>
              </div>
            </div>

            {refreshNotice && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-urdu px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{refreshNotice}</span>
              </div>
            )}

            {/* BULK ACTIONS TOOLBAR */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50/60 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-xs font-bold font-urdu text-emerald-950 hover:underline cursor-pointer"
                >
                  {selectedIds.length === filteredApplicants.length && filteredApplicants.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-emerald-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>تمام کا انتخاب کریں ({selectedIds.length} منتخب شدہ)</span>
                </button>
              </div>

              {/* Action Buttons for Selection */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => setBulkCardsModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-urdu transition-all shadow-xs ${
                    selectedIds.length > 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>بلک کارڈز پرنٹ ({selectedIds.length})</span>
                </button>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => {
                    setBulkTargetStatus('approved');
                    setBulkNoteModalOpen(true);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-urdu transition-all shadow-xs ${
                    selectedIds.length > 0
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>بلک منظور / نامنظور ({selectedIds.length})</span>
                </button>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={handleBulkDelete}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-urdu transition-all shadow-xs ${
                    selectedIds.length > 0
                      ? 'bg-rose-700 hover:bg-rose-800 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>بلک ڈیلیٹ ({selectedIds.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* APPLICANTS TABLE WITH FULL ACTIONS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs md:text-sm">
                <thead className="bg-slate-100 text-slate-700 font-bold font-urdu border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-center">
                      <Square className="w-4 h-4 mx-auto text-slate-400" />
                    </th>
                    <th className="p-3">امیدوار کی تصویر</th>
                    <th className="p-3">نام و والدیت</th>
                    <th className="p-3">منتخب کورس</th>
                    <th className="p-3">ٹریکنگ آئی ڈی / CNIC</th>
                    <th className="p-3">ڈویژن / فون</th>
                    <th className="p-3">حالت (Status)</th>
                    <th className="p-3">ایڈمن نوٹس</th>
                    <th className="p-3 text-center">اقدامات (Actions)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 font-urdu">
                        کوئی درخواست موصول نہیں ہوئی۔
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((app) => {
                      const isSelected = selectedIds.includes(app.id);

                      return (
                        <tr 
                          key={app.id} 
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isSelected ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3 text-center">
                            <button onClick={() => toggleSelect(app.id)}>
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-emerald-700" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                          </td>

                          {/* Candidate Photo */}
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {app.photoUrl ? (
                                <div className="w-12 h-14 rounded-lg overflow-hidden border-2 border-emerald-600 shadow-xs shrink-0">
                                  <img 
                                    src={app.photoUrl} 
                                    alt={app.fullName} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-14 rounded-lg bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-center p-1 shrink-0">
                                  <UserX className="w-5 h-5 text-slate-400 mb-0.5" />
                                  <span className="text-[9px] font-bold text-slate-700 font-urdu bg-slate-200 px-1 rounded">
                                    بغیر تصویر
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Candidate Name & Father Name */}
                          <td className="p-3">
                            <div className="font-bold text-slate-900 font-urdu text-sm">{app.fullName}</div>
                            <div className="text-xs text-slate-500 font-urdu">والد: {app.fatherName}</div>
                          </td>

                          {/* Selected Course */}
                          <td className="p-3">
                            <div className="bg-amber-50 text-amber-950 font-bold font-urdu text-xs p-2 rounded-xl border border-amber-300 max-w-xs leading-snug">
                              {app.selectedCourse || 'مختلف کورسز (عمومی)'}
                            </div>
                          </td>

                          {/* Tracking ID & CNIC */}
                          <td className="p-3">
                            <div className="font-mono font-bold text-emerald-900">{app.trackingNumber}</div>
                            <div className="font-mono text-xs text-slate-500">{app.cnic}</div>
                          </td>

                          {/* Division & Phone */}
                          <td className="p-3">
                            <div className="font-bold text-slate-800 font-urdu">{app.division}</div>
                            <div className="font-mono text-xs text-slate-500">{app.phone}</div>
                          </td>

                          {/* Status Badge */}
                          <td className="p-3">
                            {app.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs font-urdu">
                                <CheckCircle2 className="w-3.5 h-3.5" /> منظور شدہ
                              </span>
                            )}
                            {app.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-xs font-urdu">
                                <Clock className="w-3.5 h-3.5" /> زیرِ جائزہ
                              </span>
                            )}
                            {app.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-xs font-urdu">
                                <XCircle className="w-3.5 h-3.5" /> نامنظور
                              </span>
                            )}
                          </td>

                          {/* Admin Note */}
                          <td className="p-3">
                            <span className="text-xs text-slate-600 font-urdu line-clamp-2 max-w-xs">
                              {app.adminNote || '—'}
                            </span>
                          </td>

                          {/* Actions: Card, View, Edit, Delete */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => onOpenCardModal(app)}
                                title="ایڈمیشن کارڈ کا جائزہ"
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setSelectedDetailApplicant(app)}
                                title="تفصیلات دیکھیں"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setEditingApplicant(app)}
                                title="فارم ایڈٹ کریں"
                                className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleSingleDelete(app.id)}
                                title="ڈیلیٹ کریں"
                                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS & COURSE/CITY MANAGEMENT TAB */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COURSE MANAGEMENT CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold font-urdu text-emerald-950">
                  کورسز کی فہرست (Course Options Manager)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                {availableCourses.length} کورسز
              </span>
            </div>

            <p className="text-xs text-slate-600 font-urdu">
              یہاں سے آپ نئے کورسز شامل کر سکتے ہیں، موجودہ کورسز کو ایڈٹ یا ختم کر سکتے ہیں۔ فارم پر یہی کورسز نظر آئیں گے۔
            </p>

            {/* Add New Course */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="نیا کورس درج کریں (مثال: ایڈوانس AI اسکل کورس)..."
                value={newCourseInput}
                onChange={(e) => setNewCourseInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-urdu focus:border-emerald-700 outline-none"
              />
              <button
                onClick={handleAddCourse}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-urdu flex items-center gap-1 shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>کورس شامل کریں</span>
              </button>
            </div>

            {/* Courses List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {availableCourses.map((courseName, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-amber-50/60 rounded-xl border border-amber-300/80 flex items-center justify-between gap-2"
                >
                  {editingCourseIndex === idx ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editCourseText}
                        onChange={(e) => setEditCourseText(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-amber-400 text-xs font-urdu font-bold bg-white"
                      />
                      <button
                        onClick={() => handleSaveCourseEdit(idx)}
                        className="p-1.5 bg-emerald-700 text-white rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCourseIndex(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-xs font-urdu text-emerald-950 flex-1">
                        {idx + 1}. {courseName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCourseIndex(idx);
                            setEditCourseText(courseName);
                          }}
                          className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                          title="ایڈٹ کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(idx)}
                          className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                          title="ڈیلیٹ کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CITIES / DIVISIONS MANAGEMENT CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-bold font-urdu text-emerald-950">
                  اضلاع و ڈویژنز فہرست (Cities & Districts Manager)
                </h2>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                {availableDivisions.length} اضلاع
              </span>
            </div>

            <p className="text-xs text-slate-600 font-urdu">
              یہاں سے آپ نئے شہر یا اضلاع شامل کر سکتے ہیں تاکہ امیدوار اپنی جگہ کا درست انتخاب کر سکیں۔
            </p>

            {/* Add New City */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="نیا ضلع / شہر درج کریں (مثال: گوجرانوالہ (Gujranwala))..."
                value={newDivisionInput}
                onChange={(e) => setNewDivisionInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-urdu focus:border-emerald-700 outline-none"
              />
              <button
                onClick={handleAddDivision}
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs font-urdu flex items-center gap-1 shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>شہر شامل کریں</span>
              </button>
            </div>

            {/* Cities List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {availableDivisions.map((divisionName, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                >
                  {editingDivisionIndex === idx ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editDivisionText}
                        onChange={(e) => setEditDivisionText(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-400 text-xs font-urdu font-bold bg-white"
                      />
                      <button
                        onClick={() => handleSaveDivisionEdit(idx)}
                        className="p-1.5 bg-emerald-700 text-white rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingDivisionIndex(null)}
                        className="p-1.5 bg-slate-200 text-slate-700 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-xs font-urdu text-slate-900 flex-1">
                        {idx + 1}. {divisionName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingDivisionIndex(idx);
                            setEditDivisionText(divisionName);
                          }}
                          className="p-1.5 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                          title="ایڈٹ کریں"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDivision(idx)}
                          className="p-1.5 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                          title="ڈیلیٹ کریں"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* AUTOMATIC EMAIL NOTIFICATION LOGS TAB */}
      {activeTab === 'emails' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
            <div>
              <h2 className="text-xl font-bold font-urdu text-emerald-950 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-700" />
                <span>خودکار ای میل نوٹیفکیشن و لائیو ڈسپیچ (Live Gmail Dispatch & Logs)</span>
              </h2>
              <p className="text-xs text-slate-500 font-urdu mt-0.5">
                تمام ای میلز <strong className="text-emerald-800">syedmuhammadamir837@gmail.com</strong> سے خودکار طور پر طالب علموں کے ای میل ایڈریس پر بھیجی جاتی ہیں۔
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-900 text-white px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-xs">
              <span>FROM: syedmuhammadamir837@gmail.com</span>
            </div>
          </div>

          {/* GMAIL APP PASSWORD & TEST DISPATCH SETTINGS CARD */}
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white rounded-2xl p-5 border-2 border-amber-400 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider font-urdu block">
                  گوگل ای میل ڈسپیچ سیٹنگز (Gmail SMTP Live Configuration)
                </span>
                <h3 className="text-base font-black font-urdu text-white mt-0.5">
                  syedmuhammadamir837@gmail.com — لائیو ان باکس ڈیلیوری سیٹ اپ
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold font-mono ${isSmtpConfigured ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-400 text-amber-950'}`}>
                  {isSmtpConfigured ? '✓ GMAIL APP PASSWORD ACTIVE' : '⚠ APP PASSWORD NEEDED FOR INBOX DELIVERY'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-urdu">
              {/* Box 1: App Password Input */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 space-y-2.5">
                <label className="font-bold text-amber-300 block">
                  🔑 16-ہندسوں کا گوگل ایپ پاس ورڈ (Gmail 16-Char App Password):
                </label>
                <p className="text-[11px] text-emerald-100">
                  اگر آپ چاہتے ہیں کہ ای میلز طالب علم کے حقیقی ان باکس میں موصول ہوں، تو گوگل سیکیورٹی کی طرف سے بنایا گیا 16-حرفی App Password یہاں درج کریں:
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={gmailAppPassword}
                    onChange={(e) => setGmailAppPassword(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white text-slate-900 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={handleSaveSmtpPassword}
                    className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-4 py-2 rounded-lg transition-all text-xs font-urdu cursor-pointer shrink-0"
                  >
                    محفوظ کریں
                  </button>
                </div>
                {smtpStatusMsg && (
                  <p className="text-xs text-amber-300 font-bold mt-1">{smtpStatusMsg}</p>
                )}
              </div>

              {/* Box 2: Live Test Email Trigger */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 space-y-2.5">
                <label className="font-bold text-amber-300 block">
                  ⚡ لائیو ای میل ٹیسٹ (Send Live Test Email to Inbox):
                </label>
                <p className="text-[11px] text-emerald-100">
                  کسی بھی ای میل پر فوری طور پر آزمائشی تصدیقی پیغام بھیج کر دیکھیں:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="syedmuhammadamir837@gmail.com"
                    value={testTargetEmail}
                    onChange={(e) => setTestTargetEmail(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={handleSendTestEmail}
                    disabled={isTestingEmail}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg transition-all text-xs font-urdu cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    {isTestingEmail ? 'ارسال ہو رہی ہے...' : 'ٹیسٹ ای میل بھیجیں'}
                  </button>
                </div>
                {testResultMsg && (
                  <p className={`text-xs font-bold mt-1 ${testResultMsg.success ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {testResultMsg.text}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Email Notification History Log List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-urdu text-slate-800 border-b border-slate-200 pb-2">
              ارسال شدہ ای میلز کا ریکارڈ (Dispatched Notification Logs):
            </h3>
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs sm:text-sm font-urdu">
                      {notif.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 flex-wrap">
                    <span className="text-emerald-800 font-bold">FROM: syedmuhammadamir837@gmail.com</span>
                    <span>→</span>
                    <span className="text-slate-800 font-bold">TO: {notif.recipientEmail}</span>
                    <span>•</span>
                    <span>{new Date(notif.sentAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-urdu whitespace-pre-line">
                  {notif.bodyUrdu}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT APPLICANT MODAL */}
      {editingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 space-y-5 relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-black font-urdu text-emerald-950 text-base">
                <Edit className="w-5 h-5 text-amber-600" />
                <span>امیدوار کے کوائف تدوین (Edit Applicant Details)</span>
              </div>
              <button onClick={() => setEditingApplicant(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveApplicantEdit} className="space-y-4 text-xs font-urdu">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">پورا نام (Full Name)</label>
                  <input
                    type="text"
                    required
                    value={editingApplicant.fullName}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">والد کا نام (Father Name)</label>
                  <input
                    type="text"
                    required
                    value={editingApplicant.fatherName}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">شناختی کارڈ (CNIC)</label>
                  <input
                    type="text"
                    required
                    value={editingApplicant.cnic}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, cnic: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">موبائل نمبر (Phone)</label>
                  <input
                    type="text"
                    required
                    value={editingApplicant.phone}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">منتخب کورس (Selected Course)</label>
                  <select
                    value={editingApplicant.selectedCourse || availableCourses[0]}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, selectedCourse: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {availableCourses.map(crs => (
                      <option key={crs} value={crs}>{crs}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ڈویژن / شہر (Division)</label>
                  <select
                    value={editingApplicant.division}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {availableDivisions.map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">حالت (Status)</label>
                  <select
                    value={editingApplicant.status}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, status: e.target.value as ApplicationStatus })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    <option value="pending">زیرِ جائزہ (Pending)</option>
                    <option value="approved">منظور شدہ (Approved)</option>
                    <option value="rejected">نامنظور شدہ (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ایڈمن نوٹس (Admin Note)</label>
                  <input
                    type="text"
                    value={editingApplicant.adminNote || ''}
                    onChange={(e) => setEditingApplicant({ ...editingApplicant, adminNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingApplicant(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  منسوخ کریں
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>محفوظ کریں (Save Changes)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK APPROVE/REJECT MODAL WITH NOTE */}
      {bulkNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-urdu text-emerald-950">
                بلک منظوری / نامنظوری ({selectedIds.length} درخواستیں)
              </h3>
              <button onClick={() => setBulkNoteModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  اقدام کا انتخاب کریں (Select Bulk Action)
                </label>
                <div className="grid grid-cols-2 gap-3 font-urdu text-xs">
                  <button
                    type="button"
                    onClick={() => setBulkTargetStatus('approved')}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                      bulkTargetStatus === 'approved'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> منظور کریں (Approve)
                  </button>

                  <button
                    type="button"
                    onClick={() => setBulkTargetStatus('rejected')}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                      bulkTargetStatus === 'rejected'
                        ? 'bg-rose-700 text-white border-rose-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4" /> نامنظور کریں (Reject)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-urdu">
                  ایڈمن نوٹ کمنٹ (Administrative Note for Applicants)
                </label>
                <textarea
                  rows={3}
                  value={bulkNoteText}
                  onChange={(e) => setBulkNoteText(e.target.value)}
                  placeholder={isUrdu ? 'مثال: اسناد کی تصدیق مکمل ہو گئی ہے۔' : 'e.g. Verification complete.'}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-urdu focus:border-emerald-600"
                ></textarea>
                <span className="text-[11px] text-slate-500 font-urdu block mt-1">
                  یہ نوٹ خودکار ای میل نوٹیفکیشن میں شامل کر کے تمام منتخب امیدواروں کو بھیجا جائے گا۔
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBulkNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold font-urdu border border-slate-300 text-slate-700"
              >
                منسوخ کریں
              </button>
              <button
                onClick={handleExecuteBulkStatus}
                className="px-6 py-2 rounded-xl text-xs font-bold font-urdu bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
              >
                تبدیلی لاگو کریں اور ای میلز بھیجیں
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ADMISSION CARDS BATCH PRINT MODAL */}
      {bulkCardsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 no-print">
              <div className="flex items-center gap-2 text-emerald-950 font-bold font-urdu">
                <Printer className="w-5 h-5 text-amber-500" />
                <span>بلک ایڈمیشن کارڈز کا بیچ پرنٹ ({selectedApplicantsForCards.length} امیدواران)</span>
              </div>
              <button onClick={() => setBulkCardsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {selectedApplicantsForCards.map((applicant) => (
                <div key={applicant.id} className="border-b border-dashed border-slate-300 pb-6">
                  <AdmissionCard applicant={applicant} isUrdu={isUrdu} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 no-print">
              <button
                onClick={() => setBulkCardsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold font-urdu border border-slate-300 text-slate-700"
              >
                بند کریں
              </button>

              <button
                onClick={() => window.print()}
                className="px-8 py-2.5 rounded-xl text-xs font-bold font-urdu bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>تمام منتخب کارڈز پرنٹ کریں</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE APPLICANT DETAIL VIEW MODAL */}
      {selectedDetailApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-bold font-urdu text-emerald-950">
                <User className="w-5 h-5 text-emerald-700" />
                <span>درخواست کی مکمل تفصیلات [{selectedDetailApplicant.trackingNumber}]</span>
              </div>
              <button onClick={() => setSelectedDetailApplicant(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-urdu">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">نامِ امیدوار:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedDetailApplicant.fullName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">والد کا نام:</span>
                <span className="font-bold text-slate-900">{selectedDetailApplicant.fatherName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">شناختی کارڈ:</span>
                <span className="font-mono font-bold text-emerald-900">{selectedDetailApplicant.cnic}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">منتخب کردہ کورس:</span>
                <span className="font-bold text-amber-950">{selectedDetailApplicant.selectedCourse || 'عمومی'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">ڈویژن / شہر:</span>
                <span className="font-bold text-slate-900">{selectedDetailApplicant.division}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">فون نمبر:</span>
                <span className="font-mono text-slate-900">{selectedDetailApplicant.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">ای میل:</span>
                <span className="font-mono text-slate-900">{selectedDetailApplicant.email}</span>
              </div>
            </div>

            {/* Photo / Document Check */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs font-urdu">
              <div className="flex items-center gap-2">
                {selectedDetailApplicant.photoUrl ? (
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                ) : (
                  <UserX className="w-4 h-4 text-amber-600" />
                )}
                <span>تصویر کی صورتحال: <strong>{selectedDetailApplicant.photoUrl ? 'منسلک ہے' : 'بغیر تصویر'}</strong></span>
              </div>

              <button
                onClick={() => {
                  setSelectedDetailApplicant(null);
                  onOpenCardModal(selectedDetailApplicant);
                }}
                className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold"
              >
                ایڈمیشن کارڈ دیکھیں
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
