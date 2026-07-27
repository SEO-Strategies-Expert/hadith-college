export type PublicNavItem = {
  label: string;
  href: string;
  description?: string;
};

export type PublicNavGroup = {
  label: string;
  href: string;
  items?: PublicNavItem[];
};

export const publicNavigation: PublicNavGroup[] = [
  { label: "الرئيسية", href: "/" },
  {
    label: "عن الكلية",
    href: "/about",
    items: [
      { label: "نبذة عن الكلية", href: "/about", description: "تعريف موجز بالكلية ورسالتها العلمية." },
      { label: "الرسالة والرؤية والأهداف", href: "/about/mission-vision" },
      { label: "قالوا عن الكلية", href: "/about/testimonials" },
      { label: "جامعة أبو بكر إبراهيم", href: "/about/university" }
    ]
  },
  {
    label: "الدراسة",
    href: "/programs",
    items: [
      { label: "جميع البرامج", href: "/programs" },
      { label: "البكالوريوس", href: "/programs/bachelor" },
      { label: "الماجستير", href: "/programs/master" },
      { label: "الدكتوراه", href: "/programs/doctorate" },
      { label: "الدبلومات", href: "/diplomas" },
      { label: "الدورات", href: "/courses" },
      { label: "مناهج الدراسة", href: "/curricula" },
      { label: "الرسوم", href: "/fees" }
    ]
  },
  {
    label: "البحث العلمي",
    href: "/research",
    items: [
      { label: "بوابة البحث العلمي", href: "/research" },
      { label: "مختبر التخريج", href: "/research/takhrij-lab" },
      { label: "المواقع البحثية الحديثية", href: "/research/hadith-sites" },
      { label: "الأبحاث المحكمة والمنشورة", href: "/research/peer-reviewed" }
    ]
  },
  {
    label: "الهيئة العلمية",
    href: "/scientific-body",
    items: [
      { label: "أعضاء هيئة التدريس", href: "/scientific-body/faculty" },
      { label: "المجلس العلمي", href: "/scientific-body/scientific-council" }
    ]
  },
  {
    label: "المجلة العلمية",
    href: "/journal",
    items: [
      { label: "عن المجلة", href: "/journal" },
      { label: "الهيئة الاستشارية", href: "/journal/advisory-board" },
      { label: "الأبحاث والأعداد", href: "/journal/research" }
    ]
  },
  { label: "الأخبار", href: "/news" }
];

