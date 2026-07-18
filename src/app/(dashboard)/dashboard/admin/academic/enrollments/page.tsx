import { enrollStudent, withdrawStudent } from "@/actions/academic";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { getSelectOptions, listSections } from "@/lib/academic/academic-core";

export default async function AdminEnrollmentsPage() {
  await requireDashboardUser("admin");
  const [sections, options] = await Promise.all([listSections(), getSelectOptions()]);
  return (
    <DashboardLayout title="التسجيلات" subtitle="تسجيل طالب في شعبة، سحبه، ومنع التكرار واحترام السعة عبر قيود قاعدة البيانات." modules={dashboardModules.admin}>
      <section className="card">
        <form action={enrollStudent} className="form-grid">
          <div className="field"><label>الشعبة</label><select className="form-control" name="section_id" required>{sections.map((item: { id: string; section_code: string; courses?: { name_ar: string } | null }) => <option key={item.id} value={item.id}>{item.courses?.name_ar} - {item.section_code}</option>)}</select></div>
          <div className="field"><label>الطالب</label><select className="form-control" name="student_id" required>{options.students.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          <button className="btn gold" type="submit">تسجيل الطالب</button>
        </form>
      </section>
      <section className="card record-grid">
        {sections.flatMap((section: { id: string; section_code: string; courses?: { name_ar: string } | null; enrollments?: Array<{ id: string }> }) =>
          (section.enrollments ?? []).map((enrollment) => (
            <article className="mini-record" key={enrollment.id}>
              <b>{section.courses?.name_ar} - {section.section_code}</b>
              <span>Enrollment ID: {enrollment.id}</span>
              <form action={withdrawStudent} className="inline-form"><input name="enrollment_id" type="hidden" value={enrollment.id} /><button type="submit">سحب الطالب</button></form>
            </article>
          ))
        )}
      </section>
    </DashboardLayout>
  );
}
