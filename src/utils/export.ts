import { Applicant } from '../types';
import { SADAAT_LOGO_URL, MAIN_SADAAT_LOGO_URL, AL_KASB_LOGO_URL } from '../assets/logo';

/**
 * Export applicants data to CSV format with UTF-8 BOM for Excel support
 */
export const exportToCSV = (applicants: Applicant[]) => {
  const headers = [
    'Tracking Number',
    'Roll Number',
    'Full Name',
    'Father Name',
    'CNIC',
    'Phone',
    'Email',
    'Selected Course',
    'Division / City',
    'Address',
    'Status',
    'Admin Note',
    'Created At'
  ];

  const rows = applicants.map(app => [
    `"${app.trackingNumber}"`,
    `"${app.rollNumber || 'N/A'}"`,
    `"${app.fullName}"`,
    `"${app.fatherName}"`,
    `"${app.cnic}"`,
    `"${app.phone}"`,
    `"${app.email}"`,
    `"${app.selectedCourse || 'General'}"`,
    `"${app.division}"`,
    `"${app.address.replace(/"/g, '""')}"`,
    `"${app.status}"`,
    `"${(app.adminNote || '').replace(/"/g, '""')}"`,
    `"${new Date(app.createdAt).toLocaleDateString()}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SADAAT_Applicants_Data_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export applicants data as MS Word / HTML Document
 */
export const exportToWord = (applicants: Applicant[]) => {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>بین الاقوامی تنظیم السادات - تمام امیدواران کا ڈیٹا</title>
      <style>
        body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; }
        h1 { color: #0f5132; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #0f5132; padding: 8px; font-size: 12px; }
        th { background-color: #0f5132; color: white; }
      </style>
    </head>
    <body>
      <h1>بین الاقوامی تنظیم السادات — آن لائن رجسٹریشن رپورٹ 2026</h1>
      <p>تاریخ رپورٹ: ${new Date().toLocaleDateString()}</p>
      <p>کل رجسٹرڈ امیدواران: ${applicants.length}</p>
      
      <table>
        <thead>
          <tr>
            <th>نمبر شمار</th>
            <th>ٹریکنگ ID / رول نمبر</th>
            <th>نام و والدیت</th>
            <th>شناختی کارڈ</th>
            <th>کورس</th>
            <th>ڈویژن / شہر</th>
            <th>موبائل</th>
            <th>حالت (Status)</th>
          </tr>
        </thead>
        <tbody>
          ${applicants.map((app, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${app.trackingNumber}<br/>${app.rollNumber || ''}</td>
              <td><b>${app.fullName}</b><br/>والد: ${app.fatherName}</td>
              <td>${app.cnic}</td>
              <td>${app.selectedCourse || ''}</td>
              <td>${app.division}</td>
              <td>${app.phone}</td>
              <td>${app.status === 'approved' ? 'منظور شدہ' : app.status === 'pending' ? 'زیرِ جائزہ' : 'نامنظور'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SADAAT_Applicants_Word_Report_${new Date().toISOString().slice(0, 10)}.doc`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export printable PDF window report
 */
export const exportToPDFReport = (applicants: Applicant[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ur">
    <head>
      <meta charset="utf-8">
      <title>بین الاقوامی تنظیم السادات - سرکاری رپورٹ</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
        body { font-family: 'Noto Nastaliq Urdu', 'Segoe UI', sans-serif; padding: 20px; direction: rtl; line-height: 1.8; }
        .header { text-align: center; border-bottom: 3px solid #0f5132; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { color: #0f5132; margin: 0; font-size: 24px; }
        .stats { display: flex; justify-content: space-around; margin-bottom: 20px; background: #f0fdf4; padding: 10px; border-radius: 8px; border: 1px solid #bbf7d0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; }
        th { background-color: #0f5132; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .badge { padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10px; }
        .approved { background: #dcfce7; color: #166534; }
        .pending { background: #fef3c7; color: #92400e; }
        .rejected { background: #ffe4e6; color: #9f1239; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>بین الاقوامی تنظیم السادات — مرکزی ڈیٹا رپورٹ 2026</h1>
        <p>مختلف کورسز آن لائن پورٹل رجسٹریشن کی تفصیلی سمری</p>
      </div>

      <div class="stats">
        <div><strong>کل پورٹل اندراجات:</strong> ${applicants.length}</div>
        <div><strong>منظور شدہ:</strong> ${applicants.filter(a => a.status === 'approved').length}</div>
        <div><strong>زیرِ جائزہ:</strong> ${applicants.filter(a => a.status === 'pending').length}</div>
        <div><strong>رپورٹ کی تاریخ:</strong> ${new Date().toLocaleDateString('ur-PK')}</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ٹریکنگ آئی ڈی</th>
            <th>رول نمبر</th>
            <th>نامِ امیدوار</th>
            <th>والد کا نام</th>
            <th>شناختی کارڈ (CNIC)</th>
            <th>منتخب کردہ کورس</th>
            <th>ڈویژن</th>
            <th>موبائل نمبر</th>
            <th>حالت (Status)</th>
          </tr>
        </thead>
        <tbody>
          ${applicants.map((app, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><b>${app.trackingNumber}</b></td>
              <td>${app.rollNumber || '—'}</td>
              <td><b>${app.fullName}</b></td>
              <td>${app.fatherName}</td>
              <td>${app.cnic}</td>
              <td>${app.selectedCourse || 'عمومی'}</td>
              <td>${app.division}</td>
              <td>${app.phone}</td>
              <td>
                <span class="badge ${app.status}">
                  ${app.status === 'approved' ? 'منظور شدہ' : app.status === 'pending' ? 'زیرِ جائزہ' : 'نامنظور'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};

/**
  * Print or Save as PDF a single Admission Card in a clean dedicated window
  * Supports two formats: 'a4' (Full A4 1-Page) and 'nic' (Smart ID Pocket Card Size)
  */
export const printAdmissionCardPDF = (applicant: Applicant, format: 'a4' | 'nic' = 'a4') => {
  const rollNo = applicant.rollNumber || `SADAAT-2026-RN-${applicant.trackingNumber.slice(-4)}`;
  const examCenter = applicant.examCenter || `مرکزی دفتر بین الاقوامی تنظیم السادات، ڈویژن ${applicant.division}`;
  const examDate = applicant.examDate || '20 اگست 2026 (صبح 10:00 بجے)';
  const courseName = applicant.selectedCourse || 'مختلف کورسز - آن لائن رجسٹریشن 2026';

  const printWindow = window.open('', '_blank');

  let html = '';

  if (format === 'nic') {
    // NIC Pocket Smart Card Format (85.6mm x 54mm)
    html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ur">
      <head>
        <meta charset="utf-8">
        <title>سمارٹ_کارڈ_${applicant.trackingNumber}_${applicant.fullName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: 'Noto Nastaliq Urdu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            background-color: #f8fafc;
            margin: 0;
            padding: 15px;
            color: #0f172a;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-title {
            text-align: center;
            margin-bottom: 15px;
            font-size: 14px;
            font-weight: bold;
            color: #065f46;
          }
          .cards-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            max-width: 600px;
            margin: 0 auto;
          }
          .nic-card {
            width: 86mm;
            height: 54mm;
            border: 2px solid #065f46;
            border-radius: 8mm;
            background: #ffffff;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          /* Front Card Header */
          .nic-header {
            background: linear-gradient(135deg, #022c22 0%, #065f46 100%);
            color: #ffffff;
            padding: 3px 8px;
            border-bottom: 2px solid #f59e0b;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .nic-logo {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid #f59e0b;
            background: #fff;
            object-fit: cover;
            shrink: 0;
          }
          .nic-title {
            font-size: 8.5px;
            font-weight: bold;
            line-height: 1.1;
            color: #ffffff;
          }
          .nic-sub {
            font-size: 6.5px;
            color: #fbbf24;
          }
          /* Front Card Body */
          .nic-body {
            padding: 4px 8px;
            display: grid;
            grid-template-columns: 24mm 1fr;
            gap: 6px;
            align-items: center;
            flex: 1;
          }
          .nic-photo-box {
            width: 24mm;
            height: 30mm;
            border: 1.5px solid #065f46;
            border-radius: 4px;
            overflow: hidden;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .nic-photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .nic-photo-placeholder {
            font-size: 7px;
            color: #475569;
            font-weight: bold;
          }
          .nic-details {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .nic-field {
            line-height: 1.1;
          }
          .nic-label {
            font-size: 6px;
            color: #64748b;
            display: block;
          }
          .nic-val {
            font-size: 8px;
            font-weight: bold;
            color: #0f172a;
          }
          .nic-roll {
            background: #f0fdf4;
            border: 1px solid #059669;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 9px;
            font-weight: bold;
            color: #064e3b;
            display: inline-block;
          }
          /* Back Card Layout */
          .nic-back-body {
            padding: 6px 8px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }
          .nic-back-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 3px;
          }
          .nic-footer-bar {
            background: #022c22;
            color: #f59e0b;
            font-size: 6.5px;
            text-align: center;
            padding: 2px;
            font-weight: bold;
          }
          .cut-instructions {
            margin-top: 15px;
            padding: 10px;
            border: 1.5px dashed #059669;
            background: #ecfdf5;
            border-radius: 8px;
            text-align: center;
            font-size: 11px;
            color: #064e3b;
            max-width: 86mm;
          }
        </style>
      </head>
      <body>
        <div class="page-title">
          بین الاقوامی تنظیم السادات — جیبی سمارٹ ایڈمیشن کارڈ (NIC Size Pocket Card)
        </div>

        <div class="cards-wrapper">
          <!-- FRONT SIDE CARD -->
          <div>
            <div style="font-size: 9px; font-weight: bold; color: #065f46; margin-bottom: 3px;">
              ► سامنے کا رخ (FRONT SIDE)
            </div>
            <div class="nic-card">
              <div class="nic-header">
                <div style="display: flex; align-items: center; gap: 3px;">
                  <img src="${AL_KASB_LOGO_URL}" class="nic-logo" style="border-radius: 3px;" alt="Al-Kasb Logo" />
                  <img src="${MAIN_SADAAT_LOGO_URL}" class="nic-logo" alt="Main Logo" />
                </div>
                <div>
                  <div class="nic-title">بین الاقوامی تنظیم السادات</div>
                  <div class="nic-sub">الكاسب حبيب الله — آئی ٹی سپورٹ کونسل 2026</div>
                </div>
              </div>

              <div class="nic-body">
                <div class="nic-photo-box">
                  ${
                    applicant.photoUrl
                      ? `<img src="${applicant.photoUrl}" alt="${applicant.fullName}" />`
                      : `<div class="nic-photo-placeholder">بغیر تصویر<br/>(No Photo)</div>`
                  }
                </div>
                <div class="nic-details">
                  <div class="nic-field">
                    <span class="nic-label">نامِ امیدوار:</span>
                    <span class="nic-val" style="font-size:9.5px; color:#065f46;">${applicant.fullName}</span>
                  </div>
                  <div class="nic-field">
                    <span class="nic-label">والد کا نام:</span>
                    <span class="nic-val">${applicant.fatherName}</span>
                  </div>
                  <div class="nic-field">
                    <span class="nic-label">رول نمبر (Roll No):</span>
                    <span class="nic-roll">${rollNo}</span>
                  </div>
                  <div class="nic-field">
                    <span class="nic-label">منتخب کورس:</span>
                    <span class="nic-val" style="font-size:7px; color:#b45309;">${courseName.split('(')[0]}</span>
                  </div>
                </div>
              </div>

              <div class="nic-footer-bar">
                ڈویژن: ${applicant.division} | TRACK ID: ${applicant.trackingNumber}
              </div>
            </div>
          </div>

          <!-- BACK SIDE CARD -->
          <div>
            <div style="font-size: 9px; font-weight: bold; color: #065f46; margin-bottom: 3px;">
              ► پچھلا رخ (BACK SIDE)
            </div>
            <div class="nic-card">
              <div class="nic-header" style="background:#0f172a;">
                <div class="nic-title" style="color:#f59e0b; width: 100%; text-align: center;">
                  سرکاری تصدیق و امتحانی مرکز
                </div>
              </div>

              <div class="nic-back-body">
                <div class="nic-back-top">
                  <div>
                    <span class="nic-label">شناختی کارڈ (CNIC):</span>
                    <span class="nic-val" style="font-family: monospace;">${applicant.cnic}</span>
                  </div>
                  <div style="text-align: left;">
                    <span class="nic-label">تاریخِ امتحان:</span>
                    <span class="nic-val" style="color:#059669;">20 اگست 2026</span>
                  </div>
                </div>

                <div style="margin: 2px 0;">
                  <span class="nic-label">امتحانی مرکز / پورٹل:</span>
                  <span class="nic-val" style="font-size:7.5px;">${examCenter}</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top: 1px dashed #cbd5e1; padding-top:2px;">
                  <div style="font-size:6px; color:#64748b; font-family:monospace;">
                    QR SECURED<br/>
                    ${applicant.encryptedDataHash || 'E2E-SHA256'}
                  </div>
                  <div style="text-align:center;">
                    <div style="border-bottom:1px solid #475569; font-size:6.5px; font-weight:bold; color:#065f46; padding-bottom:1px; width:120px;">
                      سید محمد عامر نقوی
                    </div>
                    <div style="font-size:5.5px; color:#475569;">دستخط چیئرمین آئی ٹی سپورٹ کونسل</div>
                  </div>
                </div>
              </div>

              <div class="nic-footer-bar" style="background:#065f46; font-size:6px;">
                یہ کارڈ دورانِ امتحان پاس رکھنا لازمی ہے۔ www.sadaat.org
              </div>
            </div>
          </div>

          <div class="cut-instructions">
            ✂ <b>ہدایت:</b> اس پرنٹ کو اے 4 پیپر یا فوٹو پیپر پر پرنٹ کرنے کے بعد ڈاٹڈ لائن سے کاٹ کر لیمینیشن کروا کے پاس رکھیں۔
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          };
        </script>
      </body>
      </html>
    `;
  } else {
    // Standard A4 Full Page Format - STRICTLY 1 SINGLE PAGE
    html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ur">
      <head>
        <meta charset="utf-8">
        <title>اداکارڈ_${applicant.trackingNumber}_${applicant.fullName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          * { box-sizing: border-box; }
          html, body {
            height: 100vh;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: 'Noto Nastaliq Urdu', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            direction: rtl;
            color: #1e293b;
            overflow: hidden;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .card-container {
            max-width: 190mm;
            max-height: 275mm;
            margin: 2mm auto;
            border: 2.5px solid #065f46;
            border-radius: 12px;
            overflow: hidden;
            background: #ffffff;
            page-break-inside: avoid;
            page-break-after: avoid;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            background: linear-gradient(135deg, #022c22 0%, #065f46 100%);
            color: #ffffff;
            padding: 12px 18px;
            border-bottom: 3px solid #f59e0b;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .logo-box {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            border: 2px solid #f59e0b;
            overflow: hidden;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            shrink: 0;
          }
          .logo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .title-block h1 {
            margin: 0;
            font-size: 19px;
            font-weight: bold;
            color: #ffffff;
            line-height: 1.2;
          }
          .title-block p {
            margin: 1px 0 0 0;
            color: #fbbf24;
            font-size: 11px;
          }
          .badge-block {
            text-align: left;
          }
          .badge {
            background: #f59e0b;
            color: #022c22;
            font-weight: bold;
            font-size: 10px;
            padding: 3px 10px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 3px;
          }
          .tracking {
            font-family: monospace;
            font-size: 11px;
            color: #fde68a;
          }
          .body-content {
            padding: 15px 18px;
            background: #f8fafc;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .status-bar {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            color: #065f46;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 11.5px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .grid-layout {
            display: grid;
            grid-template-columns: 120px 1fr;
            gap: 15px;
            margin-bottom: 12px;
          }
          .photo-box {
            width: 115px;
            height: 145px;
            border: 2px solid #065f46;
            border-radius: 10px;
            overflow: hidden;
            background: #e2e8f0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .photo-placeholder {
            font-size: 10px;
            font-weight: bold;
            color: #475569;
            padding: 6px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .info-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            padding: 7px 10px;
            border-radius: 6px;
          }
          .info-label {
            font-size: 9.5px;
            color: #64748b;
            display: block;
            margin-bottom: 1px;
          }
          .info-value {
            font-size: 12px;
            font-weight: bold;
            color: #0f172a;
          }
          .course-highlight {
            grid-column: span 2;
            background: #fffbeb;
            border: 1px solid #fde68a;
            padding: 7px 12px;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .roll-box {
            grid-column: span 2;
            background: linear-gradient(90deg, #ecfdf5 0%, #fffbeb 100%);
            border: 1.5px solid #059669;
            padding: 8px 12px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .roll-number {
            font-family: monospace;
            font-size: 18px;
            font-weight: bold;
            color: #064e3b;
          }
          .center-box {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 12px;
          }
          .center-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            padding: 8px 10px;
            border-radius: 8px;
          }
          .instructions {
            background: #f1f5f9;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 10px;
            color: #334155;
            margin-bottom: 10px;
            line-height: 1.4;
          }
          .footer-sec {
            border-top: 1px dashed #cbd5e1;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature-line {
            width: 220px;
            border-bottom: 1px solid #64748b;
            padding-bottom: 2px;
            margin-bottom: 2px;
            font-weight: bold;
            font-size: 11px;
            color: #065f46;
            font-style: italic;
          }
          .signature-title {
            font-size: 10px;
            font-weight: bold;
            color: #334155;
          }
        </style>
      </head>
      <body>
        <div class="card-container">
          <div class="header">
            <div class="header-left">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="logo-box" style="border-radius: 8px;">
                  <img src="${AL_KASB_LOGO_URL}" alt="Al-Kasb Logo" />
                </div>
                <div class="logo-box">
                  <img src="${MAIN_SADAAT_LOGO_URL}" alt="Main Sadaat Logo" />
                </div>
              </div>
              <div class="title-block">
                <h1>بین الاقوامی تنظیم السادات</h1>
                <p>آئی ٹی سپورٹ کونسل (الكاسب حبيب الله) — آن لائن رجسٹریشن 2026</p>
              </div>
            </div>
            <div class="badge-block">
              <div class="badge">رول نمبر / ایڈمیشن کارڈ</div>
              <div class="tracking">ID: ${applicant.trackingNumber}</div>
            </div>
          </div>

          <div class="body-content">
            <div class="status-bar">
              <span>✓ تصدیق شدہ امتحانی رجسٹریشن — داخلہ کارڈ درست ہے</span>
              <span>تاریخ: 20 اگست 2026</span>
            </div>

            <div class="grid-layout">
              <div class="photo-box">
                ${
                  applicant.photoUrl
                    ? `<img src="${applicant.photoUrl}" alt="${applicant.fullName}" />`
                    : `<div class="photo-placeholder">بغیر تصویر<br/><small>(Without Photo)</small></div>`
                }
              </div>

              <div class="info-grid">
                <div class="course-highlight">
                  <span class="info-label">منتخب کردہ کورس:</span>
                  <span class="info-value" style="color: #064e3b;">${courseName}</span>
                </div>

                <div class="info-card">
                  <span class="info-label">نامِ امیدوار</span>
                  <span class="info-value">${applicant.fullName}</span>
                </div>

                <div class="info-card">
                  <span class="info-label">والد کا نام</span>
                  <span class="info-value">${applicant.fatherName}</span>
                </div>

                <div class="info-card">
                  <span class="info-label">شناختی کارڈ (CNIC)</span>
                  <span class="info-value" style="font-family: monospace;">${applicant.cnic}</span>
                </div>

                <div class="info-card">
                  <span class="info-label">مقصود ڈویژن / زون</span>
                  <span class="info-value">${applicant.division}</span>
                </div>

                <div class="roll-box">
                  <div>
                    <span class="info-label" style="color:#065f46; font-weight:bold;">ASSIGNED ROLL NUMBER</span>
                    <span class="roll-number">${rollNo}</span>
                  </div>
                  <div>
                    <span class="info-label">تعلیمی قابلیت</span>
                    <span style="font-size: 11px; font-weight: bold;">${applicant.education}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="center-box">
              <div class="center-card">
                <span class="info-label">تاریخ و وقت (Date & Time)</span>
                <span class="info-value">${examDate}</span>
              </div>
              <div class="center-card">
                <span class="info-label">امتحانی مرکز / پورٹل (Center)</span>
                <span class="info-value">${examCenter}</span>
              </div>
            </div>

            <div class="instructions">
              <strong>امیدواران کیلئے ضروری ہدایات:</strong><br/>
              • امتحان/کورس سیشن کے وقت یہ ایڈمیشن کارڈ اور اصلی شناختی کارڈ اپنے پاس رکھیں۔<br/>
              • تمام آن لائن لیکچرز 20 اگست 2026 سے اسٹوڈنٹ ڈیش بورڈ پر دستیاب ہوں گے۔
            </div>

            <div class="footer-sec">
              <div style="font-size: 9px; color: #64748b; font-family: monospace;">
                QR VERIFIED PASS<br/>
                REF: ${applicant.encryptedDataHash || 'ISO-SEC-2026'}<br/>
                ISSUE DATE: 2026-08-11
              </div>

              <div style="text-align: center;">
                <div class="signature-line">
                  سید محمد عامر نقوی (چیئرمین آئی ٹی سپورٹ کونسل)
                </div>
                <div class="signature-title">
                  دستخط و مہر چیئرمین آئی ٹی سپورٹ کونسل
                </div>
                <div style="font-size: 8px; color: #64748b; font-weight: bold;">
                  International Sadaat Organization
                </div>
              </div>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          };
        </script>
      </body>
      </html>
    `;
  }

  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    window.print();
  }
};

