import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listStudentCalendar } from "@/lib/academic/teaching-operations";

export default async function StudentCalendarPage() {
  const session = await requireDashboardUser("student");
  const meetings = session ? await listStudentCalendar(session.user.id) : [];
  return (
    <DashboardLayout title="تقويم الطالب" subtitle="محاضراتك القادمة من الشعب المسجل فيها فقط." modules={dashboardModules.student} badge="Teaching Operations MVP">
      <section className="card record-grid">
        {meetings.map((meeting) => (
          <article className="mini-record" key={meeting.id}>
            <b>{meeting.title}</b>
            <span>{new Date(meeting.starts_at).toLocaleString("ar-QA")} / {meeting.course_sections?.courses?.name_ar}</span>
            <span>{meeting.online_meeting_url ?? meeting.location ?? "بدون رابط"}</span>
          </article>
        ))}
        {meetings.length === 0 ? <p className="notice">لا توجد محاضرات قادمة.</p> : null}
      </section>
    </DashboardLayout>
  );
}
