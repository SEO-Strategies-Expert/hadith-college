export type SocialIconName = "youtube" | "facebook" | "x" | "instagram" | "telegram" | "link";

export type ManagementNavChild = {
  label: string;
  href?: string;
  icon?: SocialIconName;
  disabled?: boolean;
};

export type ManagementNavItem = {
  label: string;
  href?: string;
  icon?: string;
  featured?: boolean;
  university?: boolean;
  children?: ManagementNavChild[];
};

const disabledSocials: ManagementNavChild[] = [
  { label: "YouTube", icon: "youtube", disabled: true },
  { label: "Facebook", icon: "facebook", disabled: true },
  { label: "X", icon: "x", disabled: true },
  { label: "Instagram", icon: "instagram", disabled: true },
  { label: "Telegram", icon: "telegram", disabled: true },
  { label: "أخرى", icon: "link", disabled: true }
];

export const managementNavigation: ManagementNavItem[] = [
  { label: "الرئيسية", href: "/" },
  {
    label: "عن الكلية",
    href: "/about",
    children: [
      { label: "الرسالة والرؤية والأهداف", href: "/about/mission-vision" },
      { label: "قالوا عن الكلية", href: "/about/testimonials" }
    ]
  },
  { label: "روابط الكلية", children: disabledSocials },
  { label: "البث", href: "/live", icon: "◉" },
  {
    label: "البرامج",
    href: "/programs",
    children: [
      { label: "برنامج البكالوريوس", href: "/programs/bachelor" },
      { label: "برنامج الماجستير", href: "/programs/master" },
      { label: "برنامج الدكتوراه", href: "/programs/doctorate" }
    ]
  },
  { label: "الدبلومات", href: "/diplomas" },
  { label: "الدورات", href: "/courses" },
  { label: "مختبر التخريج", href: "/research/takhrij-lab" },
  { label: "مناهج الدراسة", href: "/curricula" },
  { label: "الرسوم", href: "/fees" },
  { label: "الكتب والكورسات المدفوعة", href: "/store" },
  {
    label: "المواقع البحثية الحديثية",
    href: "/research/hadith-sites",
    children: [
      { label: "الباحث الحديثي", disabled: true },
      { label: "الدرر السنية", disabled: true },
      { label: "المكتبة الشاملة", disabled: true }
    ]
  },
  {
    label: "الهيئة العلمية",
    children: [
      { label: "أعضاء هيئة التدريس", href: "/scientific-body/faculty" },
      { label: "المجلس العلمي", href: "/scientific-body/scientific-council" }
    ]
  },
  {
    label: "المجلة العلمية",
    children: [
      { label: "الهيئة الاستشارية", href: "/journal/advisory-board" },
      { label: "الأبحاث", href: "/journal/research" }
    ]
  },
  { label: "أبحاث مُحَكَّمة ومنشورة", href: "/research/peer-reviewed" },
  { label: "الأخبار", href: "/news" },
  {
    label: "جامعة أبو بكر إبراهيم",
    href: "/about/university",
    university: true,
    children: [
      { label: "منصة الجامعة", disabled: true },
      { label: "صفحات التواصل", disabled: true }
    ]
  }
];
