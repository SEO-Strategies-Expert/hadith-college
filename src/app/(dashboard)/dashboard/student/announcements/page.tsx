import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listStudentAnnouncements } from "@/lib/academic/teaching-operations";

export default async function StudentAnnouncementsPage() {
  const session = await requireDashboardUser("student");
  const announcements = session ? await listStudentAnnouncements(session.user.id) : [];
  return (
    <DashboardLayout title="إعلانات الطالب" subtitle="الإعلانات المستهدفة لك حسب شعبك وبرنامجك ومستواك ودورك وحسابك." modules={dashboardModules.student} badge="Teaching Operations MVP">
      <section className="card record-grid">
        {announcements.map((announcement) => (
          <article className="mini-record" key={announcement.id}>
            <b>{announcement.is_pinned ? "مثبت: " : ""}{announcement.title}</b>
            <span>{announcement.priority} / {announcement.course_sections?.section_code ?? "عام"}</span>
            <p className="muted small">{announcement.body}</p>
          </article>
        ))}
        {announcements.length === 0 ? <p className="notice">لا توجد إعلانات مستهدفة حاليًا.</p> : null}
      </section>
    </DashboardLayout>
  );
}
