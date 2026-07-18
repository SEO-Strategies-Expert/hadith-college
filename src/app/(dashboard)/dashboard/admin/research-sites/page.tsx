import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { researchSites } from "@/lib/demo-data";

export default function ResearchSitesAdminPage() {
  return (
    <DashboardLayout title="إدارة المواقع الحديثية" subtitle="بديل Next.js أولي للوحة localStorage القديمة. الحفظ الحقيقي ينتظر Supabase." modules={["قائمة المواقع", "التصنيفات", "الاستيراد والتصدير", "فحص الروابط"]}>
      <section className="card">
        <div className="card-head"><div><h2>مصادر Demo</h2><span className="muted small">سيتم تحويلها إلى جدول `research_sites`.</span></div><span className="tag demo">Read Only</span></div>
        <div className="grid grid-3">
          {researchSites.map((site) => <article className="fee-admin-stat" key={site}><span>{site}</span><b style={{ fontSize: 18 }}>Demo</b><small>قابل للنقل إلى seed.sql</small></article>)}
        </div>
      </section>
    </DashboardLayout>
  );
}
