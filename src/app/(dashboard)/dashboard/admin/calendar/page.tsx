import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dashboardModules } from "@/lib/demo-data";
import { listAdminCalendar } from "@/lib/academic/teaching-operations";

export default async function AdminCalendarPage() {
  const meetings = await listAdminCalendar();
  const now = new Date();
  const todayKey = now.toDateString();
  const nowMs = now.getTime();
  const weekEndMs = nowMs + 7 * 86400000;
  const currentMonth = now.getMonth();
  const todayCount = meetings.filter((meeting) => new Date(meeting.starts_at).toDateString() === todayKey).length;
  const weekCount = meetings.filter((meeting) => {
    const startsAt = new Date(meeting.starts_at).getTime();
    return nowMs <= startsAt && startsAt <= weekEndMs;
  }).length;
  const monthCount = meetings.filter((meeting) => new Date(meeting.starts_at).getMonth() === currentMonth).length;
  return (
    <DashboardLayout title="تقويم المحاضرات" subtitle="عرض يومي وأسبوعي وشهري وقائمة للمحاضرات القادمة بدون تكامل Zoom مدفوع." modules={dashboardModules.admin} badge="Teaching Operations MVP">
      <section className="dashboard-panel-grid">
        <article className="card"><h2>اليومي</h2><p className="metric">{todayCount}</p></article>
        <article className="card"><h2>الأسبوعي</h2><p className="metric">{weekCount}</p></article>
        <article className="card"><h2>الشهري</h2><p className="metric">{monthCount}</p></article>
      </section>
      <section className="card record-grid" style={{ marginTop: 16 }}>
        {meetings.map((meeting) => (
          <article className="mini-record" key={meeting.id}>
            <b>{meeting.title}</b>
            <span>{new Date(meeting.starts_at).toLocaleString("ar-QA")} / {meeting.course_sections?.courses?.name_ar}</span>
            <span>{meeting.meeting_mode} / {meeting.online_meeting_url ?? meeting.location ?? "بدون رابط"}</span>
          </article>
        ))}
        {meetings.length === 0 ? <p className="notice">لا توجد محاضرات مجدولة.</p> : null}
      </section>
    </DashboardLayout>
  );
}
