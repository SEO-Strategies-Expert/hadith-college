import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listFacultyAnnouncements } from "@/lib/academic/teaching-operations";

export default async function FacultyAnnouncementsPage() {
  const session = await requireDashboardUser("faculty");
  const announcements = session ? await listFacultyAnnouncements(session.user.id) : [];
  return (
    <DashboardLayout title="إعلانات المدرس" subtitle="إعلانات الشعب المسندة إليك فقط، مع احترام RLS على مستوى الشعبة." modules={dashboardModules.faculty} badge="Teaching Operations MVP">
      <section className="card record-grid">
        {announcements.map((announcement) => (
          <article className="mini-record" key={announcement.id}>
            <b>{announcement.is_pinned ? "مثبت: " : ""}{announcement.title}</b>
            <span>{announcement.priority} / {announcement.course_sections?.section_code ?? "عام"}</span>
            <p className="muted small">{announcement.body}</p>
          </article>
        ))}
        {announcements.length === 0 ? <p className="notice">لا توجد إعلانات في شعبك.</p> : null}
      </section>
    </DashboardLayout>
  );
}
