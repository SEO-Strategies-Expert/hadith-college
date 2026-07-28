import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PublicLayout } from "@/components/public/PublicLayout";
import { listPublishedPrograms } from "@/lib/academic/academic-core";
import { getHomeHero } from "@/lib/content/home";

const legacyPrograms = [
  {
    name: "التخريج ودراسة الأسانيد",
    description:
      "منهج تطبيقي لتتبع الحديث في مصادره، وجمع طرقه، ودراسة رجاله، والموازنة بين الروايات، وصياغة الحكم العلمي المعلل.",
    href: "/programs",
  },
  {
    name: "الدبلوم التأسيسي",
    description:
      "مدخل منهجي إلى مصطلح الحديث، ومناهج المحدثين، ومصادر السنة، ومهارات البحث.",
    href: "/diplomas",
  },
  {
    name: "التحقيق وعلوم المخطوطات",
    description:
      "قراءة المخطوط، وصف النسخ، المقابلة، الضبط، صناعة الحواشي، وإخراج النص المحقق.",
    href: "/programs",
  },
  {
    name: "المسار العالي",
    description:
      "تأهيل بحثي متقدم يجمع التخصصين ويقود إلى مشروع علمي أصيل.",
    href: "/programs",
  },
  {
    name: "الإجازات والدورات",
    description:
      "مجالس سماع، إجازات مسندة، ودورات إثرائية قصيرة في موضوعات دقيقة.",
    href: "/courses",
  },
];

const researchPreview = [
  {
    icon: "بح",
    name: "الباحث الحديثي",
    description:
      "محرك بحث حديثي للوصول إلى النصوص والمصادر والنتائج البحثية.",
  },
  {
    icon: "در",
    name: "الموسوعة الحديثية — الدرر السنية",
    description:
      "بحث في الأحاديث وأحكام المحدثين والشروح والموضوعات.",
  },
  {
    icon: "شم",
    name: "المكتبة الشاملة",
    description:
      "مكتبة نصية لكتب الحديث والرجال والعلل والمصطلح.",
  },
  {
    icon: "جس",
    name: "جامع السنة وشروحها",
    description:
      "بوابة تجمع نصوص السنة وشروحها وخدمات الفهرسة والبحث.",
  },
];

function BookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5z" />
    </svg>
  );
}

function HeroSection({ title, lead, primaryHref, primaryLabel, secondaryHref, secondaryLabel }: { title: string; lead: string; primaryHref: string; primaryLabel: string; secondaryHref: string; secondaryLabel: string }) {
  return <section className="hero premium-hero"><div className="container hero-grid"><div className="hero-copy reveal visible"><span className="section-kicker">كلية الحديث وعلومه</span><h1>{title}</h1><p className="lead">{lead}</p><div className="hero-points"><span>مسارات متدرجة</span><span>تعلم بالممارسة</span><span>مكتبة وقاعدة بيانات</span></div><div className="button-row"><Link className="btn gold" href={primaryHref}>{primaryLabel}</Link><Link className="btn ghost" href={secondaryHref}>{secondaryLabel}</Link></div></div><div className="hero-visual reveal visible"><div className="arch-stage"><div className="isnad-visual"><Image alt="شعار كلية الحديث وعلومه" className="isnad-mark" height={128} src="/brand/hadith-college-logo-128.png" width={128} /><h3>سندٌ متصل… ومنهجٌ محقق</h3><p>تتبع الرواية، اجمع الطرق، قارن النسخ، واكتب الحكم العلمي داخل بيئة تدريبية واحدة.</p><div className="chain"><div className="chain-row"><span>المصدر الأصلي</span><i /><span>طريق الرواية</span></div><div className="chain-row"><span>دراسة الرواة</span><i /><span>المقارنة والحكم</span></div></div></div></div><div className="floating-card fc-1"><b>مختبر التخريج</b><small>بحث · طرق · رواة · حكم</small></div><div className="floating-card fc-2"><b>مختبر التحقيق</b><small>صور · مقابلة · حواشٍ · إخراج</small></div><div className="floating-card fc-3"><b>إجازات موثقة</b><small>سجل رقمي ورمز تحقق</small></div></div></div></section>;
}

function TrustStrip({ children }: { children: ReactNode }) { return <section className="trust-strip">{children}</section>; }
function AcademicProgramsSection({ children }: { children: ReactNode }) { return <section className="section">{children}</section>; }
function ResearchLabSection({ children }: { children: ReactNode }) { return <section className="section dark">{children}</section>; }
function StudentJourneySection({ children }: { children: ReactNode }) { return <section className="section">{children}</section>; }
function FacultySection({ children }: { children: ReactNode }) { return <section className="section">{children}</section>; }
function PublicationsSection({ children }: { children: ReactNode }) { return <section className="section">{children}</section>; }
function ResearchResourcesSection({ children }: { children: ReactNode }) { return <section className="section">{children}</section>; }
function AdmissionsCTA({ children }: { children: ReactNode }) { return <section className="section compact">{children}</section>; }

export default async function HomePage() {
  const [hero, publishedPrograms] = await Promise.all([
    getHomeHero(),
    listPublishedPrograms(),
  ]);
  const programs = legacyPrograms.map((fallback, index) => {
    const published = publishedPrograms[index];
    return published
      ? {
          name: published.name_ar,
          description: published.short_description || fallback.description,
          href: `/programs/${published.slug}`,
        }
      : fallback;
  });

  return (
    <PublicLayout>
      <HeroSection lead={hero.content.lead_ar} primaryHref={hero.content.primary_href} primaryLabel={hero.content.primary_cta_ar} secondaryHref={hero.content.secondary_href} secondaryLabel={hero.content.secondary_cta_ar} title={hero.content.title_ar} />

      <TrustStrip>
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="icon-badge"><BookIcon /></div>
              <div><b>تعليم متدرج</b><span>من التأسيس حتى البحث المتقدم</span></div>
            </div>
            <div className="trust-item">
              <div className="icon-badge">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                  <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
                </svg>
              </div>
              <div><b>تطبيق عملي</b><span>تدريب على الأسانيد والطرق</span></div>
            </div>
            <div className="trust-item">
              <div className="icon-badge">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M8 13h8M8 17h6" />
                </svg>
              </div>
              <div><b>تحقيق المخطوط</b><span>مقابلة النسخ والتوثيق العلمي</span></div>
            </div>
            <div className="trust-item">
              <div className="icon-badge">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M8.2 13 7 22l5-3 5 3-1.2-9" />
                </svg>
              </div>
              <div><b>شهادات وإجازات</b><span>سجل موحد قابل للتحقق</span></div>
            </div>
          </div>
        </div>
      </TrustStrip>

      <AcademicProgramsSection>
        <div className="container">
          <div className="section-head reveal visible">
            <div className="copy">
              <span className="section-kicker">المسارات الأكاديمية</span>
              <h2>رحلة علمية واضحة، لا دورات متناثرة</h2>
              <p className="muted">
                يتقدم الطالب عبر مسار تأسيسي، ثم يتخصص في التخريج أو التحقيق،
                وصولًا إلى مستوى بحثي أعلى يجمع بين الرواية والدراية.
              </p>
            </div>
            <Link className="btn ghost" href="/programs">عرض جميع البرامج</Link>
          </div>
          <div className="bento">
            {programs.map((program, index) => (
              <article
                className={`card reveal visible ${index === 0 ? "featured dark-card" : ""} ${index === 2 ? "gold-card" : ""}`}
                key={`${program.href}-${program.name}`}
              >
                {index === 0 ? <span className="tag">المسار المحوري</span> : null}
                <div className="num">{String(index + 1).padStart(2, "0")}</div>
                <h3>{program.name}</h3>
                <p className={index === 0 || index === 2 ? undefined : "muted"}>
                  {program.description}
                </p>
                {index === 0 ? (
                  <ul className="mini-list">
                    <li>تطبيقات داخل مختبر التخريج</li>
                    <li>دراسة عملية لكتب الرجال والعلل</li>
                    <li>مشروع تخريج متكامل بإشراف علمي</li>
                  </ul>
                ) : null}
                <Link className="card-link" href={program.href}>
                  {index === 0 || index === 2 ? "تفاصيل المسار" : "استكشف البرنامج"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </AcademicProgramsSection>

      <ResearchLabSection>
        <div className="container">
          <div className="section-head reveal visible">
            <div className="copy">
              <span className="section-kicker">ميزة الكلية التنافسية</span>
              <h2>مختبران يحولان المعرفة إلى ممارسة</h2>
              <p className="muted">
                لا يكتفي الطالب بالمشاهدة؛ بل ينفذ المهمة العلمية داخل أدوات
                مصممة للتعلم، ثم يتلقى التصحيح والتغذية الراجعة.
              </p>
            </div>
            <Link className="btn ghost" href="/research/takhrij-lab">
              دخول مختبر التخريج
            </Link>
          </div>
          <div className="lab-showcase">
            <article className="lab-card reveal visible">
              <span className="tag">مختبر التخريج</span>
              <h3>ابحث، اجمع الطرق، ثم علّل الحكم</h3>
              <p className="muted">
                قاعدة بيانات حديثية تعليمية مترابطة تتيح البحث في النصوص
                والمصادر والرواة والطرق، وبناء ملف تخريج كامل مع المراجعة.
              </p>
              <div className="screen">
                <div className="screen-toolbar">
                  <span>محرك البحث الحديثي التعليمي</span>
                  <div className="dots"><i /><i /><i /></div>
                </div>
                <div className="search-mock">إنما الأعمال بالنيات…</div>
                {[
                  ["صحيح البخاري", "كتاب بدء الوحي · طريق أول", "عرض"],
                  ["صحيح مسلم", "الشواهد والمتابعات · مقارنة", "عرض"],
                  ["بطاقة الراوي", "الجرح والتعديل · طبقة الراوي", "فتح"],
                ].map(([title, detail, action]) => (
                  <div className="result-row" key={title}>
                    <span className="status" />
                    <div><b>{title}</b><small>{detail}</small></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="lab-card reveal visible">
              <span className="tag">مختبر التحقيق</span>
              <h3>قارن النسخ وأخرج نصًا موثقًا</h3>
              <p className="muted">
                إدارة مشروعات التحقيق كاملة: رفع النسخ، فهرستها، القراءة
                والمقابلة، إثبات الفروق، صناعة الحواشي، والمراجعة.
              </p>
              <div className="screen">
                <div className="screen-toolbar">
                  <span>المقابلة بين النسخ</span>
                  <div className="dots"><i /><i /><i /></div>
                </div>
                <div className="manuscript-sheet">
                  قال المصنف رحمه الله: <mark>حدثنا</mark> شيخنا بإسناده إلى
                  الإمام… ثم ذكر اختلاف اللفظ في النسخة الثانية، وأثبت ما يوافق
                  السياق والأصول.
                </div>
              </div>
            </article>
          </div>
        </div>
      </ResearchLabSection>

      <StudentJourneySection>
        <div className="container">
          <div className="section-head reveal visible">
            <div className="copy">
              <span className="section-kicker">مسار طالب العلم</span>
              <h2>خمس محطات من التأسيس إلى الإنجاز العلمي</h2>
            </div>
          </div>
          <div className="steps">
            {[
              ["التأسيس", "ضبط المصطلحات والمصادر ومناهج المحدثين."],
              ["التخصص", "اختيار مسار التخريج أو التحقيق وفق الميول والهدف."],
              ["المختبر", "تنفيذ مهمات عملية مصححة بإشراف علمي."],
              ["المشروع", "إنجاز بحث أو نص محقق بمعايير واضحة."],
              ["الإجازة والتخرج", "توثيق الإنجاز وإتاحته بسجل قابل للتحقق."],
            ].map(([title, description]) => (
              <article className="step reveal visible" key={title}>
                <h3>{title}</h3><p className="muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </StudentJourneySection>

      <FacultySection>
        <div className="container">
          <div className="section-head reveal visible">
            <div className="copy">
              <span className="section-kicker">الهيئة العلمية</span>
              <h2>خبرة علمية تقود الطالب خطوة بخطوة</h2>
              <p className="muted">
                تجمع الهيئة العلمية بين التدريس والإشراف والبحث، وتدير المقررات
                والمختبرات والمشروعات العلمية ومراجعة الإنتاج قبل نشره.
              </p>
            </div>
            <Link className="btn ghost" href="/scientific-body/faculty">
              تعرف إلى المجلس العلمي
            </Link>
          </div>
          <div className="grid-3">
            {[
              ["مجالات الإشراف العلمي", "المناهج والمعايير", "إشراف منهجي على المسارات والمخرجات العلمية."],
              ["مجالات الإشراف العلمي", "التخريج والأسانيد", "دراسة الرواة والطرق والعلل والتطبيقات العملية."],
              ["مجالات الإشراف العلمي", "تحقيق التراث", "قراءة النسخ والمقابلة والتوثيق وصناعة النص المحقق."],
            ].map(([tag, title, description]) => (
              <article className="card profile-card reveal visible" key={title}>
                <div aria-hidden="true" className="profile-art">⌘</div>
                <div className="profile-body">
                  <span className="tag">{tag}</span>
                  <h3>{title}</h3>
                  <p className="muted">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </FacultySection>

      <PublicationsSection>
        <div className="container">
          <div className="section-head reveal visible">
            <div className="copy">
              <span className="section-kicker">المعرفة والإصدارات</span>
              <h2>المحتوى العلمي جزء من تجربة الكلية</h2>
              <p className="muted">
                مقالات منهجية، تحقيقات، أبحاث محكمة، أدلة عملية، ونشرة دورية
                تربط الطالب بالممارسة البحثية.
              </p>
            </div>
            <Link className="btn ghost" href="/journal/research">
              زيارة مركز الإصدارات
            </Link>
          </div>
          <div className="grid-3">
            {[
              ["", "مركز الإصدارات", "قيد النشر", "مواد علمية وإصدارات الكلية", "ستظهر المقالات والأبحاث المنشورة هنا بعد اعتمادها من إدارة المحتوى."],
              ["gold", "علوم المخطوطات", "قيد النشر", "أدلة التحقيق والتوثيق", "ستظهر الأدلة المعتمدة عند نشرها من إدارة المحتوى."],
              ["paper", "المجلة العلمية", "قيد النشر", "الأبحاث والأعداد", "لا توجد أبحاث أو أعداد منشورة للعرض حاليًا."],
            ].map(([cover, category, meta, title, description]) => (
              <article className="card news-card reveal visible" key={title}>
                <div className={`news-cover ${cover}`} />
                <div className="news-body">
                  <div className="news-meta"><span>{category}</span><span>{meta}</span></div>
                  <h3>{title}</h3>
                  <p className="muted">{description}</p>
                  <Link className="card-link" href="/journal/research">اقرأ المزيد</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PublicationsSection>

      <ResearchResourcesSection>
        <div className="container">
          <div className="section-head reveal visible">
            <div className="copy">
              <span className="section-kicker">بوابة المصادر الخارجية</span>
              <h2>المواقع الحديثية البحثية في مكان واحد</h2>
              <p className="muted">
                دليل متجدد يضم الباحث الحديثي، والدرر السنية، والمكتبة الشاملة،
                وجامع السنة وشروحها، وغيرها من المصادر المفيدة للطالب والباحث.
              </p>
            </div>
            <Link className="btn ghost" href="/research/hadith-sites">
              عرض الدليل الكامل
            </Link>
          </div>
          <div className="research-preview">
            {researchPreview.map((site) => (
              <Link className="research-mini-card" href="/research/hadith-sites" key={site.name}>
                <span className="research-card-icon">{site.icon}</span>
                <h3>{site.name}</h3>
                <p>{site.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </ResearchResourcesSection>

      <AdmissionsCTA>
        <div className="container">
          <div className="cta-panel reveal visible">
            <div>
              <h2>ابدأ رحلتك في خدمة السنة والتراث</h2>
              <p>اختر المسار المناسب، راجع متطلبات القبول، وأرسل طلبك الأولي.</p>
            </div>
            <div className="button-row">
              <Link className="btn gold" href="/admissions">القبول والتسجيل</Link>
              <Link className="btn ghost" href="/contact">تحدث مع مستشار القبول</Link>
            </div>
          </div>
        </div>
      </AdmissionsCTA>
    </PublicLayout>
  );
}
