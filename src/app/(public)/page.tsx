import Link from "next/link";
import { ProgramGrid } from "@/components/public/ProgramGrid";
import { PublicLayout } from "@/components/public/PublicLayout";
import { researchSites } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="section-kicker">جامعة أبو بكر إبراهيم</span>
            <h1>كلية الحديث وعلومه</h1>
            <p className="lead">منصة عربية متخصصة في الرواية والدراية والتحقيق، تنتقل الآن من عرض Static إلى منصة Next.js قابلة للإدارة.</p>
            <div className="button-row">
              <Link className="btn gold" href="/admissions">قدّم الآن</Link>
              <Link className="btn ghost" href="/programs">استعرض البرامج</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="tag demo">Phase 1</span>
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
