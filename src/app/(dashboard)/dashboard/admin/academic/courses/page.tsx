import { upsertCourse } from "@/actions/academic";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { getSelectOptions, listCourses } from "@/lib/academic/academic-core";

const statuses = ["draft", "pending_review", "published", "archived"];

export default async function AdminCoursesPage() {
  await requireDashboardUser("admin");
  const [courses, options] = await Promise.all([listCourses(), getSelectOptions()]);
  return (
    <DashboardLayout title="المقررات" subtitle="إنشاء مقرر، ربطه ببرنامج ومستوى، إضافة مخرجات تعلم ومتطلبات نشر." modules={dashboardModules.admin}>
      <section className="card">
        <form action={upsertCourse} className="form-grid">
          <div className="field"><label>الكود</label><input className="form-control" name="code" required /></div>
          <div className="field"><label>الاسم العربي</label><input className="form-control" name="name_ar" required /></div>
          <div className="field"><label>Slug</label><input className="form-control" name="slug" required /></div>
          <div className="field"><label>النوع</label><input className="form-control" name="course_type" defaultValue="core" /></div>
          <div className="field full"><label>الوصف</label><textarea className="form-control" name="description" rows={3} /></div>
          <div className="field full"><label>الأهداف</label><textarea className="form-control" name="objectives" rows={3} /></div>
          <div className="field"><label>الساعات</label><input className="form-control" name="credit_hours" type="number" defaultValue={0} /></div>
          <div className="field"><label>ساعات الدراسة</label><input className="form-control" name="study_hours" type="number" /></div>
          <div className="field"><label>البرنامج</label><select className="form-control" name="program_id"><option value="">بدون</option>{options.programs.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          <div className="field"><label>المستوى</label><select className="form-control" name="level_id"><option value="">بدون</option>{options.levels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
          <div className="field"><label>درجة النجاح</label><input className="form-control" name="passing_grade" type="number" defaultValue={60} /></div>
          <div className="field"><label>الحضور المطلوب</label><input className="form-control" name="attendance_requirement" type="number" defaultValue={75} /></div>
          <div className="field"><label>الحالة</label><select className="form-control" name="status">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field full"><label>مخرج تعلم أولي</label><input className="form-control" name="outcome_ar" /></div>
          <label className="check-line"><input name="is_required" type="checkbox" defaultChecked /> مقرر إجباري</label>
          <button className="btn gold" type="submit">حفظ المقرر</button>
        </form>
      </section>
      <section className="card record-grid">
        {courses.map((course: { id: string; code: string; name_ar: string; description: string | null; status: string; credit_hours: number }) => (
          <article className="mini-record" key={course.id}><b>{course.code} - {course.name_ar}</b><span>{course.description}</span><small>{course.credit_hours} ساعات - {course.status}</small></article>
        ))}
      </section>
    </DashboardLayout>
  );
}
