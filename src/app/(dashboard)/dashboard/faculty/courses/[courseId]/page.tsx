import { createLesson, createModule } from "@/actions/learning";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getSectionForFaculty } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";

export default async function FacultyCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await requireDashboardUser("faculty");
  const { courseId } = await params;
  const section = session ? await getSectionForFaculty(courseId, session.user.id) : null;

  if (!section) {
    return (
      <DashboardLayout title="مقرر غير متاح" subtitle="لا يمكنك إدارة مقرر غير مسند إليك." modules={dashboardModules.faculty}>
        <p className="notice">RLS والـ Server Action يمنعان إدارة الشعب غير المسندة.</p>
      </DashboardLayout>
    );
  }

  const modules = section.course_modules ?? [];

  return (
    <DashboardLayout title={`إدارة ${section.courses?.name_ar ?? "المقرر"}`} subtitle={`الشعبة ${section.section_code}: وحدات ودروس ومسودات ونشر.`} modules={dashboardModules.faculty}>
      <section className="dashboard-panel-grid">
        <article className="card">
          <h2>وحدة جديدة</h2>
          <form action={createModule} className="form-grid">
            <input name="section_id" type="hidden" value={section.id} />
            <input name="course_id" type="hidden" value={section.courses?.id} />
            <div className="field"><label>عنوان الوحدة</label><input className="form-control" name="title_ar" required /></div>
            <div className="field"><label>الترتيب</label><input className="form-control" name="sort_order" type="number" defaultValue={0} /></div>
            <div className="field full"><label>الوصف</label><textarea className="form-control" name="description" rows={3} /></div>
            <div className="field"><label>الحالة</label><select className="form-control" name="status"><option>draft</option><option>published</option></select></div>
            <button className="btn gold" type="submit">حفظ الوحدة</button>
          </form>
        </article>
        <article className="card">
          <h2>درس جديد</h2>
          <form action={createLesson} className="form-grid">
            <input name="section_id" type="hidden" value={section.id} />
            <div className="field"><label>الوحدة</label><select className="form-control" name="module_id" required>{modules.map((item: { id: string; title_ar: string }) => <option key={item.id} value={item.id}>{item.title_ar}</option>)}</select></div>
            <div className="field"><label>عنوان الدرس</label><input className="form-control" name="title_ar" required /></div>
            <div className="field full"><label>نص الدرس</label><textarea className="form-control" name="content_text" rows={4} /></div>
            <div className="field"><label>فيديو</label><input className="form-control" name="video_url" /></div>
            <div className="field"><label>صوت</label><input className="form-control" name="audio_url" /></div>
            <div className="field"><label>PDF</label><input className="form-control" name="pdf_url" /></div>
            <div className="field"><label>رابط</label><input className="form-control" name="external_url" /></div>
            <div className="field full"><label>مراجع</label><textarea className="form-control" name="references_text" rows={2} /></div>
            <div className="field"><label>الحالة</label><select className="form-control" name="status"><option>draft</option><option>published</option></select></div>
            <button className="btn gold" type="submit">حفظ الدرس</button>
          </form>
        </article>
      </section>
      <section className="card record-grid">
        {modules.map((module: { id: string; title_ar: string; status: string; lessons?: Array<{ id: string; title_ar: string; status: string }> }) => (
          <article className="mini-record" key={module.id}>
            <b>{module.title_ar}</b>
            <span>{module.status}</span>
            {(module.lessons ?? []).map((lesson) => <small key={lesson.id}>{lesson.title_ar} - {lesson.status}</small>)}
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}
