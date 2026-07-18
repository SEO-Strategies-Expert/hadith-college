import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getFacultyCoursesForUser } from "@/lib/academic/academic-core";
import { getFacultyTeachingDashboard } from "@/lib/academic/teaching-operations";
import { dashboardModules } from "@/lib/demo-data";
import Link from "next/link";

export default async function FacultyDashboardPage() {
  const session = await requireDashboardUser("faculty");
  const sections = session ? await getFacultyCoursesForUser(session.user.id) : [];
  const teaching = session ? await getFacultyTeachingDashboard(session.user.id) : null;
  return (
    <DashboardLayout title="لوحة هيئة التدريس" subtitle="تشغيل تدريسي متصل: الشعب، المحاضرات، الواجبات، الاختبارات، والحضور من Supabase." modules={dashboardModules.faculty} badge="Teaching Operations MVP">
      <section className="dashboard-panel-grid">
        <article className="card"><h2>محاضرات اليوم</h2><p className="metric">{teaching?.todayMeetings.length ?? 0}</p><span className="muted small">محاضرات مجدولة ضمن الشعب المسندة.</span></article>
        <article className="card"><h2>تحتاج تقييمًا</h2><p className="metric">{teaching?.gradingQueue ?? 0}</p><span className="muted small">تسليمات واجبات بانتظار المراجعة.</span></article>
        <article className="card"><h2>اختبارات نشطة</h2><p className="metric">{teaching?.activeQuizzes ?? 0}</p><span className="muted small">اختبارات منشورة ومفتوحة للطلاب.</span></article>
        <article className="card"><h2>طلاب متعثرون</h2><p className="metric">{teaching?.atRiskStudents ?? 0}</p><span className="muted small">مؤشر أولي من الحضور والدرجات.</span></article>
      </section>
      <section className="dashboard-panel-grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>محاضرات اليوم</h2>
          <div className="record-grid">
            {(teaching?.todayMeetings ?? []).map((meeting) => (
              <div className="mini-record" key={meeting.id}>
                <b>{meeting.title}</b>
                <span>{new Date(meeting.starts_at).toLocaleString("ar-QA")} / {meeting.course_sections?.courses?.name_ar}</span>
              </div>
            ))}
            {teaching?.todayMeetings.length === 0 ? <p className="notice">لا توجد محاضرات اليوم.</p> : null}
          </div>
        </article>
        <article className="card">
          <h2>آخر الإعلانات</h2>
          <div className="record-grid">
            {(teaching?.announcements ?? []).map((announcement) => (
              <Link className="mini-record" href="/dashboard/faculty/announcements" key={announcement.id}>
                <b>{announcement.title}</b>
                <span>{announcement.priority} / {announcement.course_sections?.section_code ?? "عام"}</span>
              </Link>
            ))}
            {teaching?.announcements.length === 0 ? <p className="notice">لا توجد إعلانات منشورة.</p> : null}
          </div>
        </article>
      </section>
      <section className="card record-grid">
        {sections.map((section: { id: string; section_code: string; courses?: { code: string; name_ar: string } | null; academic_terms?: { name_ar: string } | null }) => (
          <article className="mini-record" key={section.id}>
            <b>{section.courses?.code} - {section.courses?.name_ar}</b>
            <span>{section.section_code} / {section.academic_terms?.name_ar}</span>
            <Link className="text-link" href={`/dashboard/faculty/courses/${section.id}`}>إدارة المحتوى</Link>
          </article>
        ))}
        {sections.length === 0 ? <p className="notice">لا توجد شعب مسندة لحسابك بعد.</p> : null}
      </section>
    </DashboardLayout>
  );
}
