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
  { slug: "admissions", title: "القبول والتسجيل", lead: "طلب التحاق أولي مع نظام رسوم مرن يراعي قدرة الطالب ولا يؤثر في التقييم العلمي." },
  { slug: "courses", title: "الدورات التدريبية والإثرائية", lead: "دورات قصيرة مركزة في مهارات حديثية وبحثية تخدم الطالب والباحث والمحقق." },
  { slug: "faculty", title: "الهيئة العلمية", lead: "صفحة عامة لأعضاء هيئة التدريس والمشرفين العلميين، وسترتبط لاحقًا بحسابات وصلاحيات المدرسين." },
  { slug: "library", title: "المكتبة الرقمية", lead: "واجهة مكتبة وإصدارات ومصادر، وستنتقل في المراحل التالية إلى Supabase Storage وسياسات وصول." },
  { slug: "publications", title: "الإصدارات العلمية ومجلة الكلية", lead: "أبحاث محكمة، تحقيقات، أدلة تطبيقية، ومحتوى منهجي يخدم الطالب والباحث." },
  { slug: "news", title: "الأخبار والفعاليات", lead: "أخبار الكلية والفعاليات العلمية، وستدار لاحقًا عبر CMS ومراجعات نشر." },
  { slug: "contact", title: "تواصل معنا", lead: "قنوات التواصل مع القبول والدعم التقني والمكتبة والبحث العلمي." },
  { slug: "ijazat", title: "الإجازات العلمية", lead: "مسارات الإجازة والشهادات، مع تحقق عام وملفات PDF في مرحلة لاحقة." },
  { slug: "takhrij-lab", title: "مختبر التخريج ودراسة الأسانيد", lead: "مختبر تفاعلي تعليمي لبناء مهمة تخريج وتسليمها ومراجعتها، حاليًا في وضع تحويل واجهة." },
  { slug: "manuscripts-lab", title: "مختبر التحقيق وعلوم المخطوطات", lead: "واجهة مقارنة النسخ والتفريغ والفروق والحواشي، وستستخدم تخزينًا خاصًا للمخطوطات." },
  { slug: "research-sites", title: "المواقع الحديثية البحثية", lead: "دليل مصادر بحثية خارجية مجانية، سينتقل من localStorage إلى قاعدة البيانات." }
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
    { label: "نظرة عامة", href: "/dashboard/admin" },
    { label: "المستخدمون", href: "/dashboard/admin/users" },
    { label: "هيئة التدريس", href: "/dashboard/admin/faculty" },
    { label: "الطلاب", href: "/dashboard/admin/students" },
    { label: "البرامج", href: "/dashboard/admin/academic/programs" },
    { label: "المقررات", href: "/dashboard/admin/academic/courses" },
    { label: "الفصول", href: "/dashboard/admin/academic/terms" },
    { label: "الدفعات", href: "/dashboard/admin/academic/cohorts" },
    { label: "الشعب", href: "/dashboard/admin/academic/sections" },
    { label: "التسجيلات", href: "/dashboard/admin/academic/enrollments" },
    { label: "الإعلانات", href: "/dashboard/admin/announcements" },
    { label: "التقويم", href: "/dashboard/admin/calendar" },
    { label: "تحرير الصفحة", href: "/dashboard/admin/content/home" }
  ],
  faculty: [
    { label: "لوحة المدرس", href: "/dashboard/faculty" },
    { label: "مقرراتي", href: "/dashboard/faculty/courses" },
    { label: "الإعلانات", href: "/dashboard/faculty/announcements" },
    { label: "التقويم", href: "/dashboard/faculty/calendar" }
  ],
  student: [
    { label: "لوحة الطالب", href: "/dashboard/student" },
    { label: "مقرراتي", href: "/dashboard/student/courses" },
    { label: "الإعلانات", href: "/dashboard/student/announcements" },
    { label: "التقويم", href: "/dashboard/student/calendar" }
  ]
};
