import Link from "next/link";
import { updateHomeHero } from "@/actions/content";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getHomeHero } from "@/lib/content/home";

const modules = ["تحرير الصفحة الرئيسية", "الصفحات", "الملاحة", "SEO", "سجل المراجعات"];

export default async function AdminHomeContentPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [hero, params] = await Promise.all([getHomeHero(), searchParams]);
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <DashboardLayout title="تحرير الصفحة الرئيسية" subtitle="دورة CMS الأولى: حفظ Hero في Supabase ثم ظهوره في الموقع العام." modules={modules}>
      <section className="dashboard-panel-grid">
        <article className="card">
          <div className="card-head">
            <div>
              <h2>Hero الصفحة الرئيسية</h2>
              <span className="muted small">المصدر الحالي: {hero.source === "supabase" ? "Supabase" : "Fallback Demo"}</span>
            </div>
            <Link className="primary-btn" href="/">معاينة عامة</Link>
          </div>
          <form action={updateHomeHero}>
            <div className="form-grid">
              <div className="field full"><label htmlFor="eyebrow_ar">سطر الاعتماد</label><input className="form-control" id="eyebrow_ar" name="eyebrow_ar" defaultValue={hero.content.eyebrow_ar} required /></div>
              <div className="field full"><label htmlFor="title_ar">العنوان</label><input className="form-control" id="title_ar" name="title_ar" defaultValue={hero.content.title_ar} required /></div>
              <div className="field full"><label htmlFor="lead_ar">النص الرئيسي</label><textarea className="form-control" id="lead_ar" name="lead_ar" defaultValue={hero.content.lead_ar} rows={5} required /></div>
              <div className="field"><label htmlFor="primary_cta_ar">زر رئيسي</label><input className="form-control" id="primary_cta_ar" name="primary_cta_ar" defaultValue={hero.content.primary_cta_ar} required /></div>
              <div className="field"><label htmlFor="primary_href">رابط الزر الرئيسي</label><input className="form-control" id="primary_href" name="primary_href" defaultValue={hero.content.primary_href} required /></div>
              <div className="field"><label htmlFor="secondary_cta_ar">زر ثانوي</label><input className="form-control" id="secondary_cta_ar" name="secondary_cta_ar" defaultValue={hero.content.secondary_cta_ar} required /></div>
              <div className="field"><label htmlFor="secondary_href">رابط الزر الثانوي</label><input className="form-control" id="secondary_href" name="secondary_href" defaultValue={hero.content.secondary_href} required /></div>
              <div className="field full"><button className="btn gold" type="submit">حفظ ونشر</button></div>
            </div>
          </form>
        </article>
        <article className="platform-note">
          {saved ? <p>تم الحفظ وإعادة توليد الصفحة العامة.</p> : null}
          {error ? <p>تعذر الحفظ: {error}</p> : null}
          <p>الحفظ الحقيقي يتطلب مستخدمًا لديه صلاحية `content.manage`. RLS يرفض أي مستخدم لا يملك الصلاحية.</p>
        </article>
      </section>
    </DashboardLayout>
  );
}
