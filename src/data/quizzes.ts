export interface QuizQuestion {
  id: string;
  questionUrdu: string;
  questionEnglish: string;
  optionsUrdu: string[];
  optionsEnglish: string[];
  correctOptionIndex: number;
  explanationUrdu: string;
  explanationEnglish: string;
}

export interface CourseQuizModule {
  id: string;
  moduleTitleUrdu: string;
  moduleTitleEnglish: string;
  questions: QuizQuestion[];
}

export const COURSE_QUIZZES: Record<string, CourseQuizModule[]> = {
  'بنیادی کمپیوٹر کورس (Basic Computer Course)': [
    {
      id: 'bcc-mod-1',
      moduleTitleUrdu: 'ماڈیول 1: کمپیوٹر بنیادات و ونڈوز آپریٹنگ سسٹم (Computer Basics & Windows OS)',
      moduleTitleEnglish: 'Module 1: Computer Basics & Windows OS',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'کمپیوٹر میں RAM (رینڈم ایکسس میموری) کا بنیادی مقصد کیا ہے؟',
          questionEnglish: 'What is the primary purpose of RAM in a computer?',
          optionsUrdu: [
            'عارضی ڈیٹا اسٹوریج اور تیز رفتار پروسیسنگ (Temporary Data Storage)',
            'مستقل ڈیٹا محفوظ کرنا (Permanent Storage)',
            'پرنٹنگ اور پرنٹر کنٹرول',
            'پاور سپلائی فراہم کرنا'
          ],
          optionsEnglish: [
            'Temporary high-speed data storage for active apps',
            'Permanent long-term file storage',
            'Printer hardware controller',
            'Power supply regulation'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'RAM کمپیوٹر کی عارضی میموری ہوتی ہے جو چلنے والے پروگرامز کا ڈیٹا تیز رفتاری سے پروسیسر تک پہنچاتی ہے۔',
          explanationEnglish: 'RAM provides volatile, fast memory for programs currently executing on the CPU.'
        },
        {
          id: 'q2',
          questionUrdu: 'MS Word یا کسی بھی ونڈوز ایپلیکیشن میں فائل محفوظ (Save) کرنے کی شارٹ کٹ کی کیا ہے؟',
          questionEnglish: 'What is the keyboard shortcut to Save a file in Windows applications?',
          optionsUrdu: ['Ctrl + C', 'Ctrl + S', 'Ctrl + P', 'Ctrl + V'],
          optionsEnglish: ['Ctrl + C', 'Ctrl + S', 'Ctrl + P', 'Ctrl + V'],
          correctOptionIndex: 1,
          explanationUrdu: 'Ctrl + S کی بورڈ شارٹ کٹ فائل کو فوری طور پر سیو (Save) کرنے کے لیے استعمال ہوتی ہے۔',
          explanationEnglish: 'Ctrl + S is the universal keyboard shortcut for saving documents.'
        },
        {
          id: 'q3',
          questionUrdu: 'کمپیوٹر کے بنیادی ان پٹ ڈیوائس (Input Device) کی کون سی مثال درست ہے؟',
          questionEnglish: 'Which of the following is a primary computer Input Device?',
          optionsUrdu: ['مانیٹر (Monitor)', 'پرنٹر (Printer)', 'کی بورڈ و ماؤس (Keyboard & Mouse)', 'اسپیکر (Speakers)'],
          optionsEnglish: ['Monitor', 'Printer', 'Keyboard & Mouse', 'Speakers'],
          correctOptionIndex: 2,
          explanationUrdu: 'کی بورڈ اور ماؤس ان پٹ ڈیوائسز ہیں جن کی مدد سے ڈیٹا اور ہدایات کمپیوٹر میں درج کی جاتی ہیں۔',
          explanationEnglish: 'Keyboard and mouse pass user inputs and instructions directly to the computer.'
        }
      ]
    },
    {
      id: 'bcc-mod-2',
      moduleTitleUrdu: 'ماڈیول 2: ایم ایس ایکسل اور اسپریڈ شیٹ (MS Excel & Spreadsheets)',
      moduleTitleEnglish: 'Module 2: MS Excel & Spreadsheets',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'MS Excel میں اعداد کا مجموعہ (Total Sum) معلوم کرنے کا کون سا فارمولا درست ہے؟',
          questionEnglish: 'Which formula is used to calculate total sum in MS Excel?',
          optionsUrdu: ['=SUM(A1:A10)', '=TOTAL(A1:A10)', '=ADD(A1:A10)', '=COUNT(A1:A10)'],
          optionsEnglish: ['=SUM(A1:A10)', '=TOTAL(A1:A10)', '=ADD(A1:A10)', '=COUNT(A1:A10)'],
          correctOptionIndex: 0,
          explanationUrdu: '=SUM فارمولا ایم ایس ایکسل میں نمبرز کو جمع کرنے کے لیے سب سے زیادہ استعمال ہوتا ہے۔',
          explanationEnglish: '=SUM() adds all numbers specified in a range of cells.'
        },
        {
          id: 'q2',
          questionUrdu: 'ایکسل فائل کی بنیادی ڈاکیومنٹ توسیع (File Extension) کیا ہوتی ہے؟',
          questionEnglish: 'What is the standard file extension for MS Excel workbooks?',
          optionsUrdu: ['.docx', '.xlsx', '.pdf', '.pptx'],
          optionsEnglish: ['.docx', '.xlsx', '.pdf', '.pptx'],
          correctOptionIndex: 1,
          explanationUrdu: 'MS Excel فائلز کا ایکسٹینشن .xlsx ہوتا ہے۔',
          explanationEnglish: '.xlsx is the default XML-based spreadsheet format for modern MS Excel files.'
        }
      ]
    },
    {
      id: 'bcc-mod-3',
      moduleTitleUrdu: 'ماڈیول 3: پاورپوائنٹ و پریزنٹیشن (MS PowerPoint)',
      moduleTitleEnglish: 'Module 3: MS PowerPoint Presentations',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'پاورپوائنٹ میں ڈائریکٹ سلائیڈ شو (Slide Show) شروع کرنے کی شارٹ کٹ کی کیا ہے؟',
          questionEnglish: 'Which function key starts a Slide Show from the beginning in PowerPoint?',
          optionsUrdu: ['F1', 'F5', 'F12', 'F7'],
          optionsEnglish: ['F1', 'F5', 'F12', 'F7'],
          correctOptionIndex: 1,
          explanationUrdu: 'F5 دبانے سے پاورپوائنٹ پہلی سلائیڈ سے پُوری اسکرین پر سلائیڈ شو شروع کر دیتا ہے۔',
          explanationEnglish: 'Pressing F5 launches full-screen slide presentation mode.'
        }
      ]
    },
    {
      id: 'bcc-mod-4',
      moduleTitleUrdu: 'ماڈیول 4: انٹرنیٹ و ای میل سیکورٹی (Internet & Email Essentials)',
      moduleTitleEnglish: 'Module 4: Internet & Email Essentials',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'ای میل بھیجتے وقت CC (Carbon Copy) کا بنیادی مقصد کیا ہوتا ہے؟',
          questionEnglish: 'What does CC (Carbon Copy) mean in email communication?',
          optionsUrdu: [
            'کسی دوسرے شخص کو اطلاعاً ای میل کی کاپی بھیجنا (Informational Copy)',
            'پاسورڈ تبدیل کرنا',
            'ای میل کو ہمیشہ کے لیے ڈیلیٹ کرنا',
            'ای میل میں وائرس چیک کرنا'
          ],
          optionsEnglish: [
            'Send an informational copy to secondary recipients',
            'Change account password',
            'Permanently delete email',
            'Perform security virus check'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'CC کا استعمال تب کیا جاتا ہے جب آپ کسی شخص کو ای میل کا براہِ راست جواب دہ بنائے بغیر اطلاعاً کاپی دینا چاہتے ہوں۔',
          explanationEnglish: 'CC sends a secondary copy to inform additional stakeholders without requiring primary action.'
        }
      ]
    }
  ],

  'ایڈوانس اے آئی کورس (Advance AI Course)': [
    {
      id: 'ai-mod-1',
      moduleTitleUrdu: 'ماڈیول 1: آرٹیفیشل انٹیلیجنس و پرامپٹ انجینئرنگ (AI & Prompt Engineering)',
      moduleTitleEnglish: 'Module 1: AI & Prompt Engineering Fundamentals',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'ChatGPT، Claude اور Gemini کس بنيادی AI ماڈل ٹیکنالوجی پر عمل پیرا ہیں؟',
          questionEnglish: 'ChatGPT, Claude, and Gemini are based on which core AI technology?',
          optionsUrdu: [
            'لارج لینگویج ماڈلز (Large Language Models - LLMs)',
            'روایتی ڈیٹا بیس پروسیسنگ',
            'سپلائی چین سافٹ ویئر',
            'اینٹی وائرس اسکیننگ'
          ],
          optionsEnglish: [
            'Large Language Models (LLMs)',
            'Traditional Relational Database Management',
            'Supply Chain ERP Systems',
            'Antivirus Security Engines'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'LLMs ایسے طاقتور نیورل نیٹ ورکس ہیں جو انسائیکلوپیڈک معلومات اور زبان کے انسانی فہم پر مبنی متن تیار کرتے ہیں۔',
          explanationEnglish: 'LLMs leverage deep learning transformer architectures trained on vast text data.'
        },
        {
          id: 'q2',
          questionUrdu: 'AI ماڈل سے بہترین، درست اور منظم ترین جواب حاصل کرنے کا فن کیا کہلاتا ہے؟',
          questionEnglish: 'The art of crafting precise instructions to get optimal results from AI is called:',
          optionsUrdu: ['پرامپٹ انجینئرنگ (Prompt Engineering)', 'ڈیٹا بیس ایڈمنسٹریشن', 'کمپیوٹر نیٹ ورکنگ', 'ہارڈ ویئر کیلیبریشن'],
          optionsEnglish: ['Prompt Engineering', 'Database Administration', 'Network Routing', 'Hardware Calibration'],
          correctOptionIndex: 0,
          explanationUrdu: 'پرامپٹ انجینئرنگ کے ذریعے رول، سیاق و سباق اور آؤٹ پٹ فارمیٹ کا تعین کر کے AI سے بہترین نتائج حاصل کیے جاتے ہیں۔',
          explanationEnglish: 'Prompt Engineering structures context, persona, and constraints to direct AI generation.'
        }
      ]
    },
    {
      id: 'ai-mod-2',
      moduleTitleUrdu: 'ماڈیول 2: ملٹی میڈیا AI و امیج جنریشن (Multimedia AI & Image Models)',
      moduleTitleEnglish: 'Module 2: Multimedia AI & Image Generation',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'مڈجرنی (Midjourney) اور DALL-E ٹولز کا بنيادی مقصد کیا ہے؟',
          questionEnglish: 'What is the primary function of tools like Midjourney and DALL-E?',
          optionsUrdu: [
            'متن پرامپٹ سے جدید ترین تصاویر اور آرٹ ورک تیار کرنا (Text-to-Image Generation)',
            'ایکسل میں حساب کتاب کرنا',
            'ای میل بھیجنا',
            'ونڈوز کی رفتار بڑھانا'
          ],
          optionsEnglish: [
            'Generating high-quality artwork & visuals from text prompts',
            'Calculating spreadsheet formulas',
            'Sending bulk emails',
            'Increasing Windows CPU speed'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'یہ ڈفیوژن ماڈلز ٹیکسٹ پرامپٹ کی روشنی میں لمحوں میں باوقار تصاویر اور آرٹ ورک تخلیق کرتے ہیں۔',
          explanationEnglish: 'Diffusion models synthesize original images based on text descriptions.'
        }
      ]
    },
    {
      id: 'ai-mod-3',
      moduleTitleUrdu: 'ماڈیول 3: اے آئی کوڈنگ و آٹومیشن (AI Coding & Copilot)',
      moduleTitleEnglish: 'Module 3: AI Coding & Workflow Automation',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'کودنگ میں GitHub Copilot اور AI اسسٹنٹس کا سب سے بڑا فائدہ کیا ہے؟',
          questionEnglish: 'What is the primary benefit of using GitHub Copilot in software development?',
          optionsUrdu: [
            'خودکار کوڈ کی تجاویز، بگز کا حل اور ڈویلپمنٹ کی رفتار میں 3X اضافہ',
            'کی بورڈ کا رنگ تبدیل کرنا',
            'انٹرنیٹ کی رفتار تیز کرنا',
            'کمپیوٹر بند کرنا'
          ],
          optionsEnglish: [
            'Automated code completions, bug hunting, and 3X faster development',
            'Changing keyboard backlight color',
            'Boosting internet bandwidth',
            'Shutting down PC'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'AI کوڈنگ اسسٹنٹس کوڈ کے انداز اور لاجک کو سمجھتے ہوئے خودکار تجاویز اور بگز کے فوری حل فراہم کرتے ہیں۔',
          explanationEnglish: 'AI coding assistants synthesize context-aware code blocks and auto-suggest implementations.'
        }
      ]
    },
    {
      id: 'ai-mod-4',
      moduleTitleUrdu: 'ماڈیول 4: اے آئی ایتھکس و بزنس پروسیسنگ (AI Ethics & Automation)',
      moduleTitleEnglish: 'Module 4: AI Ethics & Workflow Automation',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'بزنس اور دفتری کاموں میں AI آٹومیشن (Workflow Automation) کا بنیادی مقصد کیا ہے؟',
          questionEnglish: 'What is the core objective of AI Workflow Automation in businesses?',
          optionsUrdu: [
            'تکراری کاموں کو خودکار کر کے وقت بچانا اور پیداواری صلاحیت بڑھانا',
            'سوشل میڈیا اکاؤنٹس بلاک کرنا',
            'دفتری فرنیچر کی دیکھ بھال',
            'پرنٹر انک بچانا'
          ],
          optionsEnglish: [
            'Automating repetitive tasks to save time and multiply productivity',
            'Blocking social media accounts',
            'Office furniture management',
            'Saving printer ink'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'AI آٹومیشن انسانوں کو دہرائے جانے والے مشقت طلب کاموں سے آزاد کر کے حکمتِ عملی اور تخلیقی سرگرمیوں پر فوکس کرنے کا موقع دیتی ہے۔',
          explanationEnglish: 'Automation streamlines routine operations, mitigating human error and boosting efficiency.'
        }
      ]
    }
  ],

  'ڈیجیٹل مارکیٹنگ کورس (Digital Marketing Course)': [
    {
      id: 'dm-mod-1',
      moduleTitleUrdu: 'ماڈیول 1: ڈیجیٹل مارکیٹنگ بنیادات و برانڈنگ (Digital Marketing & Branding)',
      moduleTitleEnglish: 'Module 1: Digital Marketing & Branding',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'آن لائن ایڈورٹائزنگ میں CTR (Click-Through Rate) کا کیا مطلب ہوتا ہے؟',
          questionEnglish: 'What does CTR (Click-Through Rate) measure in digital marketing?',
          optionsUrdu: [
            'اشتہار دیکھنے والوں میں سے اس پر کلک کرنے والے افراد کا فیصد (Clicks / Impressions)',
            'فیس بک پیج کے کل فالورز',
            'کمپیوٹر کی ریم سائز',
            'ای میل کی لمبائی'
          ],
          optionsEnglish: [
            'Percentage of ad viewers who clicked on the link (Clicks / Impressions)',
            'Total Facebook page followers',
            'Computer RAM memory size',
            'Email character length'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'CTR اس بات کی پیمائش کرتا ہے کہ آپ کا اشتہار کتنا پرکشش ہے اور کتنے فیصد افراد نے اسے دیکھ کر کلک کیا۔',
          explanationEnglish: 'CTR measures user engagement efficiency by dividing total clicks by impressions.'
        }
      ]
    },
    {
      id: 'dm-mod-2',
      moduleTitleUrdu: 'ماڈیول 2: میٹا ایڈز مینیجر و فیس بک کمپین (Meta Ads & Facebook Campaigns)',
      moduleTitleEnglish: 'Module 2: Meta Ads & Facebook Campaigns',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'فیس بک اور انسٹاگرام ایڈز میں Target Audience منتخب کرنے کا اہم فائدہ کیا ہے؟',
          questionEnglish: 'What is the main advantage of Custom Target Audience in Meta Ads?',
          optionsUrdu: [
            'صرف ان افراد تک اشتہار پہنچانا جو آپ کی مصنوعات یا خدمات میں دلچسپی رکھتے ہوں',
            'پوری دنیا کے ہر بندے کو زبردستی دکھانا',
            'ویب سائٹ کو ہیکنگ سے بچانا',
            'فیس بک مفت میں چلانا'
          ],
          optionsEnglish: [
            'Reach specific demographics interested in your products/services efficiently',
            'Force ad display to every global user indiscriminately',
            'Protect site from hackers',
            'Access Facebook for free'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'ٹارگٹ آڈینس سے اشتہار کا بجٹ ضائع نہیں ہوتا اور بالکل صحیح خریداروں تک پیغام پہنچتا ہے۔',
          explanationEnglish: 'Precise targeting optimizes ROI by serving ads exclusively to high-intent demographics.'
        }
      ]
    },
    {
      id: 'dm-mod-3',
      moduleTitleUrdu: 'ماڈیول 3: کنٹینٹ مارکیٹنگ و کاپی رائٹنگ (Content Marketing & Copywriting)',
      moduleTitleEnglish: 'Module 3: Content Marketing & Copywriting',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'مارکیٹنگ کاپی رائٹنگ میں AIDA فارمولا کن چار مراحل کی نمائندگی کرتا ہے؟',
          questionEnglish: 'What does the AIDA copywriting formula stand for?',
          optionsUrdu: [
            'Attention, Interest, Desire, Action',
            'Account, Internet, Data, Application',
            'Ad, Image, Design, Art',
            'Analysis, Input, Output, Automation'
          ],
          optionsEnglish: [
            'Attention, Interest, Desire, Action',
            'Account, Internet, Data, Application',
            'Ad, Image, Design, Art',
            'Analysis, Input, Output, Automation'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'AIDA فارمولا گاہک کی توجہ حاصل کرنے، دلچسپی بڑھانے، خریدنے کی خواہش بیدار کرنے اور عمل (Action) پر ابھارنے کا کاپی رائٹنگ فریم ورک ہے۔',
          explanationEnglish: 'AIDA guides customer journey from initial Attention to eventual conversion Action.'
        }
      ]
    },
    {
      id: 'dm-mod-4',
      moduleTitleUrdu: 'ماڈیول 4: فری لانسنگ و کلائنٹ مینیجمنٹ (Freelancing & Client Management)',
      moduleTitleEnglish: 'Module 4: Freelancing & Client Management',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'فائیور (Fiverr) پلیٹ فارم پر اپنی سروس یا پیکیج کی آن لائن پیشکش کو کیا کہا جاتا ہے؟',
          questionEnglish: 'What is a service offer listing called on platforms like Fiverr?',
          optionsUrdu: ['گیگ (Gig)', 'پوسٹ (Post)', 'فائل (File)', 'بلاگ (Blog)'],
          optionsEnglish: ['Gig', 'Post', 'File', 'Blog'],
          correctOptionIndex: 0,
          explanationUrdu: 'فائیور پر فری لانسرز اپنی خدمات کو "Gig" کی شکل میں منتخب قیمت اور شرائط کے ساتھ لسٹ کرتے ہیں۔',
          explanationEnglish: 'A "Gig" defines the specific service package, scope, and pricing offered by a freelancer.'
        }
      ]
    }
  ],

  'ورڈپریس کمپلیٹ کورس (WordPress Complete Course)': [
    {
      id: 'wp-mod-1',
      moduleTitleUrdu: 'ماڈیول 1: ورڈپریس انسٹالیشن و سی ایم ایس بنیادات (WordPress CMS Basics)',
      moduleTitleEnglish: 'Module 1: WordPress CMS & Installation',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'ورڈپریس (WordPress) کی بنیاد کس قسم کے سافٹ ویئر فریم ورک پر ہے؟',
          questionEnglish: 'What type of software platform is WordPress?',
          optionsUrdu: [
            'اوپن سورس کنٹینٹ مینیجمنٹ سسٹم (Open Source CMS)',
            'ویڈیو ایڈیٹنگ سافٹ ویئر',
            'اینٹی وائرس پروگرام',
            'آپریٹنگ سسٹم'
          ],
          optionsEnglish: [
            'Open Source Content Management System (CMS)',
            'Video editing suite',
            'Antivirus utility',
            'Computer operating system'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'ورڈپریس دنیا کا سب سے مقبول اوپن سورس CMS ہے جو PHP اور MySQL پر کام کرتا ہے۔',
          explanationEnglish: 'WordPress is a globally dominant PHP/MySQL open-source content management system.'
        }
      ]
    },
    {
      id: 'wp-mod-2',
      moduleTitleUrdu: 'ماڈیول 2: ایلیمنٹر پیج بلڈر و تھیم ڈیزائننگ (Elementor Page Builder)',
      moduleTitleEnglish: 'Module 2: Elementor Page Builder & Themes',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'ورڈپریس میں بغیر کوڈنگ کے خوبصورت ڈریگ اینڈ ڈراپ ویب سائٹس بنانے کا مشھور پیج بلڈر کون سا ہے؟',
          questionEnglish: 'Which popular drag-and-drop page builder allows code-free design in WordPress?',
          optionsUrdu: ['ایلیمنٹر (Elementor)', 'نوٹ پیڈ (Notepad)', 'ایکسل (Excel)', 'پینٹ (MS Paint)'],
          optionsEnglish: ['Elementor', 'Notepad', 'Excel', 'MS Paint'],
          correctOptionIndex: 0,
          explanationUrdu: 'Elementor کے ذریعے بصری طور پر ڈریگ اینڈ ڈراپ کر کے پروفیشنل ویب سائٹس منٹوں میں ڈیزائن کی جا سکتی ہیں۔',
          explanationEnglish: 'Elementor is a visual frontend page builder for WordPress.'
        }
      ]
    },
    {
      id: 'wp-mod-3',
      moduleTitleUrdu: 'ماڈیول 3: پلگ انز و فنکشنلٹی (Plugins & Customizations)',
      moduleTitleEnglish: 'Module 3: Plugins & Customizations',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'ورڈپریس ویب سائٹ میں نئی خصوصیات یا فیچرز کا اضافہ کرنے کے لیے کیا استعمال ہوتا ہے؟',
          questionEnglish: 'What component adds new features and functionalities to a WordPress site?',
          optionsUrdu: ['پلگ ان (Plugin)', 'ونڈوز ڈرائیور', 'صوتی اثرات', 'مانیٹر ریزولوشن'],
          optionsEnglish: ['Plugin', 'Windows Driver', 'Audio Effects', 'Monitor Resolution'],
          correctOptionIndex: 0,
          explanationUrdu: 'پلگ انز (Plugins) ورڈپریس ویب سائٹ کے فیچرز اور کارکردگی میں زبردست اضافہ کرتے ہیں۔',
          explanationEnglish: 'Plugins extend core WordPress functionalities and enable specialized capabilities.'
        }
      ]
    },
    {
      id: 'wp-mod-4',
      moduleTitleUrdu: 'ماڈیول 4: وو کامرس و ای کامرس اسٹور (WooCommerce E-Commerce)',
      moduleTitleEnglish: 'Module 4: WooCommerce & E-Commerce Stores',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'ورڈپریس ویب سائٹ کو آن لائن شاپنگ ای کامرس اسٹور میں تبدیل کرنے والا سب سے مشھور پلگ ان کون سا ہے؟',
          questionEnglish: 'Which plugin transforms a WordPress site into a complete online e-commerce store?',
          optionsUrdu: ['وو کامرس (WooCommerce)', 'کلاسک ایڈیٹر', 'ہیلو ڈولی', 'سائٹ میپ'],
          optionsEnglish: ['WooCommerce', 'Classic Editor', 'Hello Dolly', 'Sitemap Generator'],
          correctOptionIndex: 0,
          explanationUrdu: 'WooCommerce کے ذریعے آن لائن پروڈکٹس، کارٹ، اور پیمنٹ گیٹ ویز کا مکمل آن لائن اسٹور قائم ہوتا ہے۔',
          explanationEnglish: 'WooCommerce powers millions of e-commerce storefronts globally on WordPress.'
        }
      ]
    }
  ],

  'ایس ای او کمپلیٹ کورس (SEO Complete Course)': [
    {
      id: 'seo-mod-1',
      moduleTitleUrdu: 'ماڈیول 1: کی ورڈ ریسرچ و آن پیج SEO (Keyword Research & On-Page SEO)',
      moduleTitleEnglish: 'Module 1: Keyword Research & On-Page SEO',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'On-Page SEO میں Meta Description کا بنیادی کام کیا ہوتا ہے؟',
          questionEnglish: 'What is the function of Meta Description in On-Page SEO?',
          optionsUrdu: [
            'گوگل سرچ رزلٹس میں ویب سائٹ کے عنوان کے نیچے مختصر خلاصہ دکھانا',
            'ویب سائٹ کو پاسورڈ پروٹیکٹ کرنا',
            'ویب سائٹ کا رنگ تبدیل کرنا',
            'سائٹ کا ڈومین نام خریدنا'
          ],
          optionsEnglish: [
            'Display a brief summary under search result titles on Google',
            'Password protect website',
            'Change website theme background color',
            'Purchase website domain name'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'میٹا ڈسکرپشن سرچ انجن کے نتائج میں صارف کو بتاتی ہے کہ اس صفحے پر کیا مواد موجود ہے۔',
          explanationEnglish: 'Meta Descriptions summarize page content in Google SERP snippet previews.'
        }
      ]
    },
    {
      id: 'seo-mod-2',
      moduleTitleUrdu: 'ماڈیول 2: ٹیکنیکل SEO و گوگل سرچ کنسول (Technical SEO & Search Console)',
      moduleTitleEnglish: 'Module 2: Technical SEO & Search Console',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'گوگل سرچ کنسول (Google Search Console) کا بنيادی مقصد کیا ہے؟',
          questionEnglish: 'What is the primary role of Google Search Console for webmasters?',
          optionsUrdu: [
            'گوگل سرچ میں ویب سائٹ کی پرفارمنس، انڈیکسنگ اور بگز کی نگرانی کرنا',
            'آن لائن کپڑے فروخت کرنا',
            'فیس بک ایڈز چلانا',
            'ای میل سرور بنانا'
          ],
          optionsEnglish: [
            'Monitor website search indexing, technical bugs, and Google organic traffic',
            'Sell clothes online',
            'Run Facebook ad campaigns',
            'Build an email server'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'گوگل سرچ کنسول ویب ماسٹرز کو بتاتا ہے کہ گوگل ان کی سائٹ کو کس طرح انڈیکس کر رہا ہے اور کون سے الفاظ پر ٹریفک مل رہی ہے۔',
          explanationEnglish: 'Google Search Console tracks site indexability, search queries, impressions, and technical issues.'
        }
      ]
    },
    {
      id: 'seo-mod-3',
      moduleTitleUrdu: 'ماڈیول 3: آف پیج SEO و بیک لنکس (Off-Page SEO & Backlinks)',
      moduleTitleEnglish: 'Module 3: Off-Page SEO & Backlinks',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'سرچ انجن کی نظر میں کسی دوسری معتبر ویب سائٹ سے اپنی سائٹ پر آنے والے لنک کو کیا کہتے ہیں؟',
          questionEnglish: 'What is an incoming link from another authoritative website called?',
          optionsUrdu: ['بیک لنک (Backlink)', 'انٹرنل لنک', 'ڈیلیٹ لنک', 'ڈومین رجسٹرار'],
          optionsEnglish: ['Backlink', 'Internal Link', 'Broken Link', 'Domain Registrar'],
          correctOptionIndex: 0,
          explanationUrdu: 'بیک لنک (Backlink) ایک قسم کا ووٹ ہوتا ہے جو گوگل کی نظر میں ویب سائٹ کے اعتماد اور اتھاریٹی کو بڑھاتا ہے۔',
          explanationEnglish: 'Backlinks pass domain authority and act as trust signals for search algorithms.'
        }
      ]
    },
    {
      id: 'seo-mod-4',
      moduleTitleUrdu: 'ماڈیول 4: لوکل SEO و گوگل بزنس پروفائل (Local SEO & Business Profile)',
      moduleTitleEnglish: 'Module 4: Local SEO & Google Business Profile',
      questions: [
        {
          id: 'q1',
          questionUrdu: 'مقامی کسٹمرز (مثلاً شہر کے لوگ) کی تلاش میں نقشے پر اوپر آنے کے لیے کون سا گوگل ٹول اہم ہے؟',
          questionEnglish: 'Which Google tool is vital for local map pack rankings and local search visibility?',
          optionsUrdu: [
            'گوگل بزنس پروفائل (Google Business Profile)',
            'گوگل اینالیٹکس',
            'گوگل ڈرائیو',
            'گوگل میٹ'
          ],
          optionsEnglish: [
            'Google Business Profile',
            'Google Analytics',
            'Google Drive',
            'Google Meet'
          ],
          correctOptionIndex: 0,
          explanationUrdu: 'گوگل بزنس پروفائل کے ذریعے مقامی دکان یا سروس کو گوگل میپس اور مقامی تلاش میں ٹاپ پر دکھایا جاتا ہے۔',
          explanationEnglish: 'Google Business Profile establishes local physical presence on Google Maps and Local Pack.'
        }
      ]
    }
  ]
};

// Helper function to get quiz modules for a selected course name
export function getQuizModulesForCourse(courseName?: string): CourseQuizModule[] {
  if (!courseName) return COURSE_QUIZZES['بنیادی کمپیوٹر کورس (Basic Computer Course)'];

  for (const [key, modules] of Object.entries(COURSE_QUIZZES)) {
    if (courseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(courseName.toLowerCase())) {
      return modules;
    }
  }

  // Matching partial keyword
  if (courseName.includes('کمپیوٹر') || courseName.toLowerCase().includes('computer')) {
    return COURSE_QUIZZES['بنیادی کمپیوٹر کورس (Basic Computer Course)'];
  }
  if (courseName.includes('اے آئی') || courseName.toLowerCase().includes('ai')) {
    return COURSE_QUIZZES['ایڈوانس اے آئی کورس (Advance AI Course)'];
  }
  if (courseName.includes('مارکیٹنگ') || courseName.toLowerCase().includes('marketing')) {
    return COURSE_QUIZZES['ڈیجیٹل مارکیٹنگ کورس (Digital Marketing Course)'];
  }
  if (courseName.includes('ورڈپریس') || courseName.toLowerCase().includes('wordpress')) {
    return COURSE_QUIZZES['ورڈپریس کمپلیٹ کورس (WordPress Complete Course)'];
  }
  if (courseName.includes('ایس ای او') || courseName.toLowerCase().includes('seo')) {
    return COURSE_QUIZZES['ایس ای او کمپلیٹ کورس (SEO Complete Course)'];
  }

  return COURSE_QUIZZES['بنیادی کمپیوٹر کورس (Basic Computer Course)'];
}
