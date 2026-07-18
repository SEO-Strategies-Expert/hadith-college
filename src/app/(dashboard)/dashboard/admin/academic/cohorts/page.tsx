import { createCohort } from "@/actions/academic";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getSelectOptions, listCohorts } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";

export default async function AdminCohortsPage() {
  await requireDashboardUser("admin");
  const [cohorts, options] = await Promise.all([listCohorts(), getSelectOptions()]);
  return (
    <DashboardLayout title="الدفعات" subtitle="إنشاء دفعة مرتبطة ببرنامج وفصل دراسي وسعة." modules={dashboardModules.admin}>
      <section className="card">
        <form action={createCohort} className="form-grid">
          <div className="field"><label>البرنامج</label><select className="form-control" name="program_id" required>{options.programs.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          <div className="field"><label>الفصل</label><select className="form-control" name="term_id"><option value="">بدون</option>{options.terms.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          <div className="field"><label>الاسم</label><input className="form-control" name="name_ar" required /></div>
          <div className="field"><label>Slug</label><input className="form-control" name="slug" required /></div>
          <div className="field"><label>السعة</label><input className="form-control" name="capacity" type="number" /></div>
          <div className="field"><label>الحالة</label><select className="form-control" name="status"><option>draft</option><option>published</option><option>archived</option></select></div>
          <button className="btn gold" type="submit">حفظ الدفعة</button>
        </form>
      </section>
      <section className="card record-grid">{cohorts.map((cohort: { id: string; name_ar: string; status: string; capacity: number | null; academic_programs?: { name_ar: string } | null }) => <article className="mini-record" key={cohort.id}><b>{cohort.name_ar}</b><span>{cohort.academic_programs?.name_ar}</span><small>السعة: {cohort.capacity ?? "غير محددة"} - {cohort.status}</small></article>)}</section>
    </DashboardLayout>
  );
}
