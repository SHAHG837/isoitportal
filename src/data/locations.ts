export interface DivisionItem {
  divisionUrdu: string;
  divisionEnglish: string;
  citiesUrdu: string[];
}

export interface ProvinceItem {
  provinceUrdu: string;
  provinceEnglish: string;
  divisions: DivisionItem[];
}

export const PAKISTAN_LOCATION_DATA: ProvinceItem[] = [
  {
    provinceUrdu: 'پنجاب (Punjab)',
    provinceEnglish: 'Punjab',
    divisions: [
      {
        divisionUrdu: 'لاہور ڈویژن (Lahore Division)',
        divisionEnglish: 'Lahore Division',
        citiesUrdu: ['لاہور (Lahore)', 'قصور (Kasur)', 'شیخوپورہ (Sheikhupura)', 'ننکانہ صاحب (Nankana Sahib)']
      },
      {
        divisionUrdu: 'راولپنڈی ڈویژن (Rawalpindi Division)',
        divisionEnglish: 'Rawalpindi Division',
        citiesUrdu: ['راولپنڈی (Rawalpindi)', 'اٹک (Attock)', 'چکوال (Chakwal)', 'جہلم (Jhelum)', 'مری (Murree)', 'تلہ گنگ (Talagang)']
      },
      {
        divisionUrdu: 'فیصل آباد ڈویژن (Faisalabad Division)',
        divisionEnglish: 'Faisalabad Division',
        citiesUrdu: ['فیصل آباد (Faisalabad)', 'چنیوٹ (Chiniot)', 'جھنگ (Jhang)', 'ٹوبہ ٹیک سنگھ (Toba Tek Singh)']
      },
      {
        divisionUrdu: 'ملتان ڈویژن (Multan Division)',
        divisionEnglish: 'Multan Division',
        citiesUrdu: ['ملتان (Multan)', 'خانیوال (Khanewal)', 'لودھراں (Lodhran)', 'وہاڑی (Vehari)']
      },
      {
        divisionUrdu: 'گوجرانوالہ ڈویژن (Gujranwala Division)',
        divisionEnglish: 'Gujranwala Division',
        citiesUrdu: ['گوجرانوالہ (Gujranwala)', 'سیالکوٹ (Sialkot)', 'نارووال (Narowal)', 'حافظ آباد (Hafizabad)']
      },
      {
        divisionUrdu: 'گجرات ڈویژن (Gujrat Division)',
        divisionEnglish: 'Gujrat Division',
        citiesUrdu: ['گجرات (Gujrat)', 'منڈی بہاؤالدین (Mandi Bahauddin)', 'وزیر آباد (Wazirabad)']
      },
      {
        divisionUrdu: 'سرگودھا ڈویژن (Sargodha Division)',
        divisionEnglish: 'Sargodha Division',
        citiesUrdu: ['سرگودھا (Sargodha)', 'بھکر (Bhakkar)', 'خوشاب (Khushab)', 'میاں والی (Mianwali)']
      },
      {
        divisionUrdu: 'ساہیوال ڈویژن (Sahiwal Division)',
        divisionEnglish: 'Sahiwal Division',
        citiesUrdu: ['ساہیوال (Sahiwal)', 'اوکاڑہ (Okara)', 'پاکپتن (Pakpattan)']
      },
      {
        divisionUrdu: 'بہاولپور ڈویژن (Bahawalpur Division)',
        divisionEnglish: 'Bahawalpur Division',
        citiesUrdu: ['بہاولپور (Bahawalpur)', 'بہاولنگر (Bahawalnagar)', 'رحیم یار خان (Rahim Yar Khan)']
      },
      {
        divisionUrdu: 'ڈیرہ غازی خان ڈویژن (D.G. Khan Division)',
        divisionEnglish: 'D.G. Khan Division',
        citiesUrdu: ['ڈیرہ غازی خان (D.G. Khan)', 'لیہ (Layyah)', 'مظفر گڑھ (Muzaffargarh)', 'راجن پور (Rajanpur)', 'کوٹ ادو (Kot Addu)', 'تونسہ شریف (Taunsa Sharif)']
      }
    ]
  },
  {
    provinceUrdu: 'سندھ (Sindh)',
    provinceEnglish: 'Sindh',
    divisions: [
      {
        divisionUrdu: 'کراچی ڈویژن (Karachi Division)',
        divisionEnglish: 'Karachi Division',
        citiesUrdu: [
          'کراچی شرقی (Karachi East)', 
          'کراچی غربی (Karachi West)', 
          'کراچی جنوبی (Karachi South)', 
          'کراچی مرکزی (Karachi Central)', 
          'ملیر (Malir)', 
          'کورنگی (Korangi)', 
          'کیماڑی (Keamari)'
        ]
      },
      {
        divisionUrdu: 'حیدرآباد ڈویژن (Hyderabad Division)',
        divisionEnglish: 'Hyderabad Division',
        citiesUrdu: ['حیدرآباد (Hyderabad)', 'بدین (Badin)', 'دادو (Dadu)', 'جامشورو (Jamshoro)', 'مٹیاری (Matiari)', 'ٹنڈو الہیار (Tando Allahyar)', 'ٹنڈو محمد خان (Tando Muhammad Khan)', 'ٹھٹھہ (Thatta)', 'سجاول (Sujawal)']
      },
      {
        divisionUrdu: 'سکھر ڈویژن (Sukkur Division)',
        divisionEnglish: 'Sukkur Division',
        citiesUrdu: ['سکھر (Sukkur)', 'گھوٹکی (Ghotki)', 'خیرپور (Khairpur)']
      },
      {
        divisionUrdu: 'لاڑکانہ ڈویژن (Larkana Division)',
        divisionEnglish: 'Larkana Division',
        citiesUrdu: ['لاڑکانہ (Larkana)', 'جیکب آباد (Jacobabad)', 'کشمور (Kashmore)', 'قنبر شہداد کوٹ (Qambar Shahdadkot)', 'شکارپور (Shikarpur)']
      },
      {
        divisionUrdu: 'میرپورخاص ڈویژن (Mirpur Khas Division)',
        divisionEnglish: 'Mirpur Khas Division',
        citiesUrdu: ['میرپورخاص (Mirpur Khas)', 'تھرپارکر (Tharparkar / Mithi)', 'عمرکوٹ (Umerkot)']
      },
      {
        divisionUrdu: 'شہید بینظیر آباد ڈویژن (Shaheed Benazirabad Division)',
        divisionEnglish: 'Shaheed Benazirabad Division',
        citiesUrdu: ['نواب شاہ / بینظیر آباد (Nawabshah)', 'نوشہرو فیروز (Naushahro Feroze)', 'سانگھڑ (Sanghar)']
      }
    ]
  },
  {
    provinceUrdu: 'خیبر پختونخوا (Khyber Pakhtunkhwa)',
    provinceEnglish: 'Khyber Pakhtunkhwa',
    divisions: [
      {
        divisionUrdu: 'پشاور ڈویژن (Peshawar Division)',
        divisionEnglish: 'Peshawar Division',
        citiesUrdu: ['پشاور (Peshawar)', 'چارسدہ (Charsadda)', 'نوشہرہ (Nowshera)', 'ضلع خیبر (Khyber)', 'ضلع مہمند (Mohmand)']
      },
      {
        divisionUrdu: 'مردان ڈویژن (Mardan Division)',
        divisionEnglish: 'Mardan Division',
        citiesUrdu: ['مردان (Mardan)', 'صوابی (Swabi)']
      },
      {
        divisionUrdu: 'ہزارہ ڈویژن (Hazara Division)',
        divisionEnglish: 'Hazara Division',
        citiesUrdu: ['ایبٹ آباد (Abbottabad)', 'مانسہرہ (Mansehra)', 'ہری پور (Haripur)', 'بٹگرام (Battagram)', 'تورغر (Torghar)', 'بالائی کوہستان (Upper Kohistan)', 'زیریں کوہستان (Lower Kohistan)', 'کولئی پالس (Kolai-Palas)']
      },
      {
        divisionUrdu: 'مالاکنڈ / سوات ڈویژن (Malakand Division)',
        divisionEnglish: 'Malakand Division',
        citiesUrdu: ['سوات / مینگورہ (Swat)', 'بونیر (Buner)', 'چترال بالائی (Upper Chitral)', 'چترال زیریں (Lower Chitral)', 'دیر بالائی (Upper Dir)', 'دیر زیریں (Lower Dir)', 'شانگلہ (Shangla)', 'باجوڑ (Bajaur)', 'مالاکنڈ (Malakand)']
      },
      {
        divisionUrdu: 'کوہاٹ ڈویژن (Kohat Division)',
        divisionEnglish: 'Kohat Division',
        citiesUrdu: ['کوہاٹ (Kohat)', 'ہنگو (Hangu)', 'کرک (Karak)', 'ضلع کرم (Kurram)', 'ضلع اورکزئی (Orakzai)']
      },
      {
        divisionUrdu: 'بنوں ڈویژن (Bannu Division)',
        divisionEnglish: 'Bannu Division',
        citiesUrdu: ['بنوں (Bannu)', 'لکی مروت (Lakki Marwat)', 'شمالی وزیرستان (North Waziristan)']
      },
      {
        divisionUrdu: 'ڈیرہ اسماعیل خان ڈویژن (D.I. Khan Division)',
        divisionEnglish: 'D.I. Khan Division',
        citiesUrdu: ['ڈیرہ اسماعیل خان (D.I. Khan)', 'ٹانک (Tank)', 'جنوبی وزیرستان (South Waziristan)']
      }
    ]
  },
  {
    provinceUrdu: 'بلوچستان (Balochistan)',
    provinceEnglish: 'Balochistan',
    divisions: [
      {
        divisionUrdu: 'کوئٹہ ڈویژن (Quetta Division)',
        divisionEnglish: 'Quetta Division',
        citiesUrdu: ['کوئٹہ (Quetta)', 'چمن (Chaman)', 'پشین (Pishin)', 'قلعہ عبداللہ (Killa Abdullah)', 'کاریزات (Karizat)']
      },
      {
        divisionUrdu: 'مکران ڈویژن (Makran Division)',
        divisionEnglish: 'Makran Division',
        citiesUrdu: ['گوادر (Gwadar)', 'تربت / کیچ (Turbat/Kech)', 'پنجگور (Panjgur)']
      },
      {
        divisionUrdu: 'قلات ڈویژن (Kalat Division)',
        divisionEnglish: 'Kalat Division',
        citiesUrdu: ['خضدار (Khuzdar)', 'قلات (Kalat)', 'مستونگ (Mastung)', 'سوراب (Surab)', 'آواران (Awaran)', 'حب (Hub)']
      },
      {
        divisionUrdu: 'نصیر آباد ڈویژن (Nasirabad Division)',
        divisionEnglish: 'Nasirabad Division',
        citiesUrdu: ['نصیر آباد (Nasirabad)', 'ڈیرہ مراد جمالی (Dera Murad Jamali)', 'جعفر آباد (Jaffarabad)', 'صحبت پور (Sohbatpur)', 'اوستہ محمد (Usta Muhammad)', 'جھل مگسی (Jhal Magsi)']
      },
      {
        divisionUrdu: 'ژوب ڈویژن (Zhob Division)',
        divisionEnglish: 'Zhob Division',
        citiesUrdu: ['ژوب (Zhob)', 'قلعہ سیف اللہ (Killa Saifullah)', 'شیرانی (Sherani)']
      },
      {
        divisionUrdu: 'رخشان ڈویژن (Rakhshan Division)',
        divisionEnglish: 'Rakhshan Division',
        citiesUrdu: ['نوشکی (Nushki)', 'خاران (Kharan)', 'واشک (Washuk)', 'چغئی (Chagai)']
      },
      {
        divisionUrdu: 'لورالائی ڈویژن (Loralai Division)',
        divisionEnglish: 'Loralai Division',
        citiesUrdu: ['لورالائی (Loralai)', 'بارکھان (Barkhan)', 'موسیٰ خیل (Musakhel)', 'دوکی (Duki)']
      },
      {
        divisionUrdu: 'سبی ڈویژن (Sibi Division)',
        divisionEnglish: 'Sibi Division',
        citiesUrdu: ['سبی (Sibi)', 'زیارت (Ziarat)', 'ہرنائی (Harnai)', 'ڈیرہ بگٹی (Dera Bugti)', 'کوہلو (Kohlu)']
      }
    ]
  },
  {
    provinceUrdu: 'اسلام آباد کیپٹل (Islamabad Capital Territory)',
    provinceEnglish: 'Islamabad Capital Territory',
    divisions: [
      {
        divisionUrdu: 'اسلام آباد وفاقی علاقہ (Islamabad Capital)',
        divisionEnglish: 'Islamabad Capital Area',
        citiesUrdu: ['اسلام آباد شہر (Islamabad City)', 'اسلام آباد سیکٹرز (Islamabad Sectors)', 'اسلام آباد دیہی (Islamabad Rural)']
      }
    ]
  },
  {
    provinceUrdu: 'گلگت بلتستان (Gilgit-Baltistan)',
    provinceEnglish: 'Gilgit-Baltistan',
    divisions: [
      {
        divisionUrdu: 'گلگت ڈویژن (Gilgit Division)',
        divisionEnglish: 'Gilgit Division',
        citiesUrdu: ['گلگت (Gilgit)', 'ہنزہ (Hunza)', 'نگر (Nagar)', 'غذر (Ghizer)']
      },
      {
        divisionUrdu: 'بلتستان ڈویژن (Baltistan Division)',
        divisionEnglish: 'Baltistan Division',
        citiesUrdu: ['سکردو (Skardu)', 'گانچھے (Ghanche)', 'کھرمنگ (Kharmang)', 'شگر (Shigar)']
      },
      {
        divisionUrdu: 'دیامیر ڈویژن (Diamer Division)',
        divisionEnglish: 'Diamer Division',
        citiesUrdu: ['چلاس / دیامیر (Chilas/Diamer)', 'استور (Astore)', 'داریل (Darel)', 'تنگیر (Tangir)']
      }
    ]
  },
  {
    provinceUrdu: 'آزاد جموں و کشمیر (Azad Jammu & Kashmir)',
    provinceEnglish: 'Azad Jammu & Kashmir',
    divisions: [
      {
        divisionUrdu: 'مظفر آباد ڈویژن (Muzaffarabad Division)',
        divisionEnglish: 'Muzaffarabad Division',
        citiesUrdu: ['مظفر آباد (Muzaffarabad)', 'نیلم / وادیِ نیلم (Neelum Valley)', 'ہٹیاں بالا (Hattian Bala)']
      },
      {
        divisionUrdu: 'میرپور ڈویژن (Mirpur Division)',
        divisionEnglish: 'Mirpur Division',
        citiesUrdu: ['میرپور (Mirpur)', 'کوٹلی (Kotli)', 'بھمبر (Bhimber)']
      },
      {
        divisionUrdu: 'پونچھ ڈویژن (Poonch Division)',
        divisionEnglish: 'Poonch Division',
        citiesUrdu: ['راولاکوٹ (Rawalakot)', 'باغ (Bagh)', 'حویلی (Haveli)', 'پلندری / سدھنوتی (Palandri)']
      }
    ]
  }
];

export const ALL_PROVINCES = PAKISTAN_LOCATION_DATA.map(p => p.provinceUrdu);

export const getDivisionsForProvince = (provinceName: string): string[] => {
  const prov = PAKISTAN_LOCATION_DATA.find(p => p.provinceUrdu === provinceName || p.provinceEnglish === provinceName);
  if (!prov) return PAKISTAN_LOCATION_DATA[0].divisions.map(d => d.divisionUrdu);
  return prov.divisions.map(d => d.divisionUrdu);
};

export const getCitiesForDivision = (provinceName: string, divisionName: string): string[] => {
  const prov = PAKISTAN_LOCATION_DATA.find(p => p.provinceUrdu === provinceName || p.provinceEnglish === provinceName);
  if (!prov) return ['لاہور (Lahore)'];
  const div = prov.divisions.find(d => d.divisionUrdu === divisionName || d.divisionEnglish === divisionName);
  if (!div) return prov.divisions[0]?.citiesUrdu || ['لاہور (Lahore)'];
  return div.citiesUrdu;
};
