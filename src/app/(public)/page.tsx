import Link from "next/link";
import { ProgramGrid } from "@/components/public/ProgramGrid";
import { PublicLayout } from "@/components/public/PublicLayout";
import { getHomeHero } from "@/lib/content/home";
import { listPublishedPrograms } from "@/lib/academic/academic-core";

const quickLinks = [
  ["دخول الطالب", "/dashboard/student", "الوصول إلى المقررات والجدول والنتائج."],
  ["البث المباشر", "/live", "حالة البث والمحاضرات القادمة والتسجيلات."],
  ["البرامج الأكاديمية", "/programs", "استكشف برامج الكلية المنشورة."],
  ["الدبلومات والدورات", "/diplomas", "مسارات تعلم مرنة وقصيرة."],
  ["مختبر التخريج", "/research/takhrij-lab", "بوابة البحث التطبيقي في الحديث."],
  ["المجلة العلمية", "/journal", "المجلة والأبحاث والأعداد العلمية."],
  ["المواقع البحثية", "/research/hadith-sites", "دليل المصادر الخارجية المتاحة."],
  ["الرسوم والمناهج", "/fees", "معلومات الدراسة العامة قبل التسجيل."]
];

export default async function HomePage() {
  const [hero, programs] = await Promise.all([getHomeHero(), listPublishedPrograms()]);

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="section-kicker">{hero.content.eyebrow_ar}</span>
            <h1>{hero.content.title_ar}</h1>
            <p className="lead">{hero.content.lead_ar}</p>
            <div className="button-row">
              <Link className="btn primary" href="/programs">استكشف البرامج</Link>
              <Link className="btn secondary" href="/dashboard/student">دخول الطالب</Link>
            </div>
          </div>
          <div className="university-card">
            <span className="university-mark" aria-hidden="true">أ ب إ</span>
            <span className="section-kicker">الانتماء الجامعي</span>
            <h2>جامعة أبو بكر إبراهيم</h2>
            <p>تعرف إلى الجامعة من خلال المعلومات المنشورة والمتاحة حاليًا.</p>
            <Link className="text-link" href="/about/university">عن الجامعة والعلاقة بالكلية</Link>
          </div>
        </div>
      </section>
      <section className="section compact">
        <div className="container">
          <div className="section-head"><div className="copy"><span className="section-kicker">الوصول السريع</span><h2>ابدأ من وجهتك</h2></div></div>
          <div className="quick-access-grid">
            {quickLinks.map(([label, href, description], index) => (
              <Link className="quick-access-card" href={href} key={href}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <b>{label}</b>
                <small>{description}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><div className="copy"><span className="section-kicker">الدراسة</span><h2>البرامج الأكاديمية</h2><p>تظهر هنا البرامج المنشورة فعليًا من النظام الأكاديمي.</p></div><Link className="text-link" href="/programs">جميع البرامج</Link></div>
          <ProgramGrid programs={programs} />
        </div>
      </section>
      <section className="section section-ivory">
        <div className="container editorial-grid">
          <article className="editorial-card">
            <span className="section-kicker">تعلم مرن</span><h2>الدبلومات والدورات</h2>
            <p>مساحة مخصصة للبرامج القصيرة والدبلومات عند نشرها رسميًا.</p>
            <div className="button-row"><Link className="text-link" href="/diplomas">الدبلومات</Link><Link className="text-link" href="/courses">الدورات</Link></div>
          </article>
          <article className="editorial-card dark">
            <span className="section-kicker">البحث الحديثي</span><h2>مختبر التخريج والبحث العلمي</h2>
            <p>مداخل منظمة للمختبر والمواقع البحثية والأبحاث المحكمة.</p>
            <Link className="btn secondary" href="/research">استكشف البحث العلمي</Link>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container feature-columns">
          <article><span className="section-kicker">الهيئة العلمية</span><h2>التدريس والإشراف العلمي</h2><p>تصفح أعضاء هيئة التدريس والمجلس العلمي عند توفر بياناتهم المنشورة.</p><Link className="text-link" href="/scientific-body">الهيئة العلمية</Link></article>
          <article><span className="section-kicker">النشر الأكاديمي</span><h2>المجلة والأبحاث المحكمة</h2><p>بوابة مستقلة للمجلة وهيئتها الاستشارية وأبحاثها المنشورة.</p><Link className="text-link" href="/journal">المجلة العلمية</Link></article>
          <article><span className="section-kicker">الأخبار والفعاليات</span><h2>آخر ما نُشر</h2><p>لا توجد أخبار منشورة للعرض حاليًا.</p><Link className="text-link" href="/news">صفحة الأخبار</Link></article>
        </div>
      </section>
      <section className="section compact">
        <div className="container university-band">
          <div><span className="section-kicker">جامعة أبو بكر إبراهيم</span><h2>سياق جامعي واضح</h2><p>تُعرض المعلومات المؤسسية المتاحة فقط دون إضافة ادعاءات اعتماد أو روابط غير موثقة.</p></div>
          <Link className="btn secondary" href="/about/university">تعرف إلى الجامعة</Link>
        </div>
      </section>
      <section className="section compact"><div className="container cta-panel"><div><h2>ابدأ رحلتك العلمية</h2><p>استكشف البرامج المنشورة أو ادخل إلى حسابك لمتابعة الدراسة.</p></div><div className="button-row"><Link className="btn gold" href="/programs">البرامج الأكاديمية</Link><Link className="btn secondary" href="/dashboard/student">دخول الطالب</Link></div></div></section>
    </PublicLayout>
  );
}
