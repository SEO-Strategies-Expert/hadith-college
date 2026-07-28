export type Program = {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  duration: string;
  status: "published";
  isDemo: true;
};

export const programs: Program[] = [];

export const publicPages = [
  { slug: "about", title: "عن الكلية", lead: "كلية تدريسية بحثية متخصصة في علوم الحديث رواية ودراية، وفي التخريج ودراسة الأسانيد والتحقيق وعلوم المخطوطات." },
  { slug: "about/mission-vision", title: "الرسالة والرؤية والأهداف", lead: "مساحة للمحتوى المؤسسي المعتمد عند نشره من إدارة الكلية." },
  { slug: "about/testimonials", title: "قالوا عن الكلية", lead: "لا توجد شهادات أو اقتباسات منشورة للعرض حاليًا." },
  { slug: "about/university", title: "جامعة أبو بكر إبراهيم", lead: "المعلومات المتاحة عن الجامعة وعلاقتها بالكلية دون إضافة ادعاءات غير موثقة." },
  { slug: "admissions", title: "القبول والتسجيل", lead: "طلب التحاق أولي مع نظام رسوم مرن يراعي قدرة الطالب ولا يؤثر في التقييم العلمي." },
  { slug: "courses", title: "الدورات التدريبية والإثرائية", lead: "دورات قصيرة مركزة في مهارات حديثية وبحثية تخدم الطالب والباحث والمحقق." },
  { slug: "diplomas", title: "الدبلومات", lead: "الدبلومات المنشورة من الكلية ستظهر هنا عند توفر بياناتها المعتمدة." },
  { slug: "curricula", title: "مناهج الدراسة", lead: "عرض عام للبرامج والمستويات والمقررات المنشورة، دون المواد التعليمية الخاصة." },
  { slug: "fees", title: "الرسوم والدعم", lead: "معلومات الرسوم وسياسات الدعم المنشورة رسميًا فقط." },
  { slug: "store", title: "الكتب والكورسات", lead: "فهرس تعريفي فقط؛ الدفع الإلكتروني والتحميل المدفوع غير مفعّلين." },
  { slug: "live", title: "البث المباشر", lead: "مركز حالة البث والمحاضرات القادمة والتسجيلات المتاحة." },
  { slug: "research", title: "البحث العلمي", lead: "بوابة مختبر التخريج والمصادر البحثية والأبحاث المحكمة." },
  { slug: "research/takhrij-lab", title: "مختبر التخريج", lead: "مدخل عام إلى مختبر التخريج والبحث الحديثي." },
  { slug: "research/hadith-sites", title: "المواقع البحثية الحديثية", lead: "دليل منظم للمواقع البحثية؛ لا يظهر رابط خارجي ما لم يكن موثقًا." },
  { slug: "research/peer-reviewed", title: "الأبحاث المحكمة والمنشورة", lead: "الأبحاث المنشورة رسميًا ستظهر هنا عند توفرها." },
  { slug: "scientific-body", title: "الهيئة العلمية", lead: "بوابة أعضاء هيئة التدريس والمجلس العلمي." },
  { slug: "scientific-body/faculty", title: "أعضاء هيئة التدريس", lead: "تظهر ملفات أعضاء هيئة التدريس المنشورة من النظام الأكاديمي." },
  { slug: "scientific-body/scientific-council", title: "المجلس العلمي", lead: "تظهر بيانات المجلس العلمي بعد اعتمادها ونشرها." },
  { slug: "journal", title: "المجلة العلمية", lead: "بوابة المجلة العلمية وهيئتها الاستشارية وأبحاثها وأعدادها." },
  { slug: "journal/advisory-board", title: "الهيئة الاستشارية", lead: "تظهر بيانات الهيئة الاستشارية بعد اعتمادها ونشرها." },
  { slug: "journal/research", title: "أبحاث وأعداد المجلة", lead: "لا توجد أبحاث أو أعداد منشورة للعرض حاليًا." },
  { slug: "faculty", title: "الهيئة العلمية", lead: "صفحة عامة لأعضاء هيئة التدريس والمشرفين العلميين، وسترتبط لاحقًا بحسابات وصلاحيات المدرسين." },
  { slug: "library", title: "المكتبة الرقمية", lead: "واجهة مكتبة وإصدارات ومصادر، وستنتقل في المراحل التالية إلى Supabase Storage وسياسات وصول." },
  { slug: "publications", title: "الإصدارات العلمية ومجلة الكلية", lead: "أبحاث محكمة، تحقيقات، أدلة تطبيقية، ومحتوى منهجي يخدم الطالب والباحث." },
  { slug: "news", title: "الأخبار والفعاليات", lead: "أخبار الكلية والفعاليات العلمية، وستدار لاحقًا عبر CMS ومراجعات نشر." },
  { slug: "contact", title: "تواصل معنا", lead: "قنوات التواصل مع القبول والدعم التقني والمكتبة والبحث العلمي." },
  { slug: "ijazat", title: "الإجازات العلمية", lead: "مسارات الإجازة والشهادات، مع تحقق عام وملفات PDF في مرحلة لاحقة." },
  { slug: "takhrij-lab", title: "مختبر التخريج ودراسة الأسانيد", lead: "مختبر تفاعلي تعليمي لبناء مهمة تخريج وتسليمها ومراجعتها، حاليًا في وضع تحويل واجهة." },
  { slug: "manuscripts-lab", title: "مختبر التحقيق وعلوم المخطوطات", lead: "واجهة مقارنة النسخ والتفريغ والفروق والحواشي، وستستخدم تخزينًا خاصًا للمخطوطات." },
  { slug: "research-sites", title: "المواقع الحديثية البحثية", lead: "دليل مصادر بحثية خارجية مجانية، سينتقل من localStorage إلى قاعدة البيانات." },
  { slug: "hadith-research-sites", title: "المواقع الحديثية البحثية", lead: "أدوات بحثية مختارة لطلاب علوم الحديث." },
  { slug: "program-foundation", title: "الدبلوم التأسيسي في علوم الحديث", lead: "مسار تمهيدي متدرج في علوم الحديث." },
  { slug: "program-higher", title: "المسار العالي والبحث المتقدم", lead: "مسار بحثي متقدم للدارسين." },
  { slug: "program-manuscripts", title: "التحقيق وعلوم المخطوطات", lead: "مسار تطبيقي في التحقيق العلمي." },
  { slug: "program-takhrij", title: "التخريج ودراسة الأسانيد", lead: "مسار تطبيقي لدراسة الأسانيد." }
] as const;

export const researchSites = [
  "الباحث الحديثي",
  "الموسوعة الحديثية - الدرر السنية",
  "المكتبة الشاملة",
  "جامع السنة وشروحها",
  "موسوعة الأحاديث النبوية",
  "المكتبة الوقفية",
  "Sunnah.com"
];

export const dashboardModules = {
  admin: [
    { label: "نظرة عامة", href: "/dashboard/admin", group: "النظرة العامة" },
    { label: "البرامج", href: "/dashboard/admin/academic/programs", group: "الشؤون الأكاديمية" },
    { label: "المقررات", href: "/dashboard/admin/academic/courses", group: "الشؤون الأكاديمية" },
    { label: "الفصول", href: "/dashboard/admin/academic/terms", group: "الشؤون الأكاديمية" },
    { label: "الدفعات", href: "/dashboard/admin/academic/cohorts", group: "الشؤون الأكاديمية" },
    { label: "الشعب", href: "/dashboard/admin/academic/sections", group: "الشؤون الأكاديمية" },
    { label: "التسجيلات", href: "/dashboard/admin/academic/enrollments", group: "الشؤون الأكاديمية" },
    { label: "المستخدمون", href: "/dashboard/admin/users", group: "الأشخاص" },
    { label: "الطلاب", href: "/dashboard/admin/students", group: "الأشخاص" },
    { label: "هيئة التدريس", href: "/dashboard/admin/faculty", group: "الأشخاص" },
    { label: "الإعلانات", href: "/dashboard/admin/announcements", group: "التدريس" },
    { label: "التقويم", href: "/dashboard/admin/calendar", group: "التدريس" },
    { label: "تحرير الصفحة", href: "/dashboard/admin/content/home", group: "المحتوى العام" },
    { label: "المواقع البحثية", href: "/dashboard/admin/research-sites", group: "البحث العلمي" }
  ],
  faculty: [
    { label: "لوحة المدرس", href: "/dashboard/faculty", group: "النظرة العامة" },
    { label: "مقرراتي", href: "/dashboard/faculty/courses", group: "التدريس" },
    { label: "الإعلانات", href: "/dashboard/faculty/announcements", group: "التدريس" },
    { label: "التقويم", href: "/dashboard/faculty/calendar", group: "التدريس" }
  ],
  student: [
    { label: "لوحة الطالب", href: "/dashboard/student", group: "النظرة العامة" },
    { label: "مقرراتي", href: "/dashboard/student/courses", group: "الدراسة" },
    { label: "الإعلانات", href: "/dashboard/student/announcements", group: "الدراسة" },
    { label: "التقويم", href: "/dashboard/student/calendar", group: "الدراسة" }
  ]
};
