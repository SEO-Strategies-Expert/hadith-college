import { assignInstructor, createSection } from "@/actions/academic";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { getSelectOptions, listSections } from "@/lib/academic/academic-core";

export default async function AdminSectionsPage() {
  await requireDashboardUser("admin");
  const [sections, options] = await Promise.all([listSections(), getSelectOptions()]);
  return (
    <DashboardLayout title="الشعب" subtitle="إنشاء شعبة وتعيين مدرس أو أكثر مع احترام السعة ومنع التسجيل المكرر في قاعدة البيانات." modules={dashboardModules.admin}>
      <section className="dashboard-panel-grid">
        <article className="card">
          <h2>إنشاء شعبة</h2>
          <form action={createSection} className="form-grid">
            <div className="field"><label>المقرر</label><select className="form-control" name="course_id" required>{options.courses.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label>الفصل</label><select className="form-control" name="term_id" required>{options.terms.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label>الدفعة</label><select className="form-control" name="cohort_id"><option value="">بدون</option>{options.cohorts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label>رمز الشعبة</label><input className="form-control" name="section_code" required /></div>
            <div className="field"><label>السعة</label><input className="form-control" name="capacity" type="number" defaultValue={30} /></div>
            <div className="field"><label>النمط</label><input className="form-control" name="meeting_mode" defaultValue="online" /></div>
            <div className="field"><label>المنطقة الزمنية</label><input className="form-control" name="timezone" defaultValue="Asia/Qatar" /></div>
            <div className="field"><label>الحالة</label><select className="form-control" name="status"><option>draft</option><option>published</option><option>archived</option></select></div>
            <button className="btn gold" type="submit">حفظ الشعبة</button>
          </form>
        </article>
        <article className="card">
          <h2>تعيين مدرس</h2>
          <form action={assignInstructor} className="form-grid">
            <div className="field"><label>الشعبة</label><select className="form-control" name="section_id" required>{sections.map((item: { id: string; section_code: string; courses?: { name_ar: string } | null }) => <option key={item.id} value={item.id}>{item.courses?.name_ar} - {item.section_code}</option>)}</select></div>
            <div className="field"><label>المدرس</label><select className="form-control" name="faculty_id" required>{options.faculty.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label>الدور</label><select className="form-control" name="role"><option>instructor</option><option>teaching_assistant</option></select></div>
            <button className="btn gold" type="submit">تعيين</button>
          </form>
        </article>
      </section>
      <section className="card record-grid">
        {sections.map((section: { id: string; section_code: string; capacity: number; status: string; courses?: { code: string; name_ar: string } | null; academic_terms?: { name_ar: string } | null; enrollments?: unknown[]; course_instructors?: Array<{ faculty_profiles?: { full_name_ar: string } | null }> }) => (
          <article className="mini-record" key={section.id}>
            <b>{section.courses?.code} - {section.section_code}</b>
            <span>{section.courses?.name_ar} / {section.academic_terms?.name_ar}</span>
            <small>{(section.enrollments ?? []).length}/{section.capacity} طالب - {section.status}</small>
            <small>المدرسون: {(section.course_instructors ?? []).map((item) => item.faculty_profiles?.full_name_ar).filter(Boolean).join("، ") || "لم يحدد"}</small>
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}
