import { createTerm } from "@/actions/academic";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listTerms } from "@/lib/academic/academic-core";

export default async function AdminTermsPage() {
  await requireDashboardUser("admin");
  const terms = await listTerms();
  return (
    <DashboardLayout title="الفصول الدراسية" subtitle="إنشاء فصل دراسي ومواعيد التسجيل والدراسة." modules={dashboardModules.admin}>
      <section className="card">
        <form action={createTerm} className="form-grid">
          <div className="field"><label>الاسم</label><input className="form-control" name="name_ar" required /></div>
          <div className="field"><label>Slug</label><input className="form-control" name="slug" required /></div>
          <div className="field"><label>يبدأ</label><input className="form-control" name="starts_at" type="date" required /></div>
          <div className="field"><label>ينتهي</label><input className="form-control" name="ends_at" type="date" required /></div>
          <div className="field"><label>الحالة</label><select className="form-control" name="status"><option>draft</option><option>published</option><option>archived</option></select></div>
          <button className="btn gold" type="submit">حفظ الفصل</button>
        </form>
      </section>
      <section className="card record-grid">{terms.map((term: { id: string; name_ar: string; starts_at: string; ends_at: string; status: string }) => <article className="mini-record" key={term.id}><b>{term.name_ar}</b><span>{term.starts_at} - {term.ends_at}</span><small>{term.status}</small></article>)}</section>
    </DashboardLayout>
  );
}
