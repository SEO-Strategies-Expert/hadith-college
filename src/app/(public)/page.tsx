import Link from "next/link";
import { ProgramGrid } from "@/components/public/ProgramGrid";
import { PublicLayout } from "@/components/public/PublicLayout";
import { researchSites } from "@/lib/demo-data";
import { getHomeHero } from "@/lib/content/home";

export default async function HomePage() {
  const hero = await getHomeHero();

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="section-kicker">{hero.content.eyebrow_ar}</span>
            <h1>{hero.content.title_ar}</h1>
            <p className="lead">{hero.content.lead_ar}</p>
            <div className="button-row">
              <Link className="btn gold" href={hero.content.primary_href}>{hero.content.primary_cta_ar}</Link>
              <Link className="btn ghost" href={hero.content.secondary_href}>{hero.content.secondary_cta_ar}</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="tag demo">{hero.source === "supabase" ? "Supabase CMS" : "Fallback Demo"}</span>
            <h2>تحويل تقني منظم</h2>
            <p>هذه النسخة تحفظ الهوية الحالية وتجهز المسارات والمكونات قبل ربط Supabase والصلاحيات.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head"><div className="copy"><span className="section-kicker">البرامج</span><h2>مسارات علمية قابلة للإدارة</h2></div></div>
          <ProgramGrid />
        </div>
      </section>
      <section className="section compact">
        <div className="container grid-2">
          <article className="card">
            <span className="section-kicker">المواقع الحديثية</span>
            <h2 style={{ fontSize: 30 }}>مصادر بحثية Demo</h2>
            <p className="muted">ستنتقل هذه القائمة إلى جدول `research_sites` في Supabase بدل `localStorage`.</p>
            <div className="research-tags">{researchSites.map((site) => <span className="research-tag" key={site}>{site}</span>)}</div>
          </article>
          <article className="platform-note">
            <b>تنبيه حالة التنفيذ:</b> هذه بداية منصة Next.js وليست اكتمالًا نهائيًا. تسجيل الدخول وRLS وقاعدة البيانات والتكاملات الخارجية تنتظر مراحل لاحقة وإجراءات بشرية للأسرار والمصادقة.
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}
