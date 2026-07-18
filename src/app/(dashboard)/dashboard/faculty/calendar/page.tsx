import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listFacultyCalendar } from "@/lib/academic/teaching-operations";

export default async function FacultyCalendarPage() {
  const session = await requireDashboardUser("faculty");
  const meetings = session ? await listFacultyCalendar(session.user.id) : [];
  return (
    <DashboardLayout title="تقويم المدرس" subtitle="محاضرات الشعب المسندة إليك مع روابط اجتماعات قابلة للإدارة." modules={dashboardModules.faculty} badge="Teaching Operations MVP">
      <section className="card record-grid">
        {meetings.map((meeting) => (
          <article className="mini-record" key={meeting.id}>
            <b>{meeting.title}</b>
            <span>{new Date(meeting.starts_at).toLocaleString("ar-QA")} / {meeting.course_sections?.section_code}</span>
            <span>{meeting.online_meeting_url ?? meeting.location ?? "بدون رابط"}</span>
          </article>
        ))}
        {meetings.length === 0 ? <p className="notice">لا توجد محاضرات في تقويمك.</p> : null}
      </section>
    </DashboardLayout>
  );
}
