import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dashboardModules } from "@/lib/demo-data";
import { listAdminAnnouncements } from "@/lib/academic/teaching-operations";

export default async function AdminAnnouncementsPage() {
  const announcements = await listAdminAnnouncements();
  return (
    <DashboardLayout title="الإعلانات الأكاديمية" subtitle="عرض شامل للإعلانات العامة والموجهة حسب البرنامج والمستوى والدفعة والشعبة والمقرر والدور والمستخدم." modules={dashboardModules.admin} badge="Teaching Operations MVP">
      <section className="card record-grid">
        {announcements.map((announcement) => (
          <article className="mini-record" key={announcement.id}>
            <b>{announcement.is_pinned ? "مثبت: " : ""}{announcement.title}</b>
            <span>{announcement.priority} / {announcement.status} / {announcement.course_sections?.courses?.name_ar ?? "استهداف متعدد"}</span>
            <p className="muted small">{announcement.body}</p>
          </article>
        ))}
        {announcements.length === 0 ? <p className="notice">لا توجد إعلانات بعد.</p> : null}
      </section>
    </DashboardLayout>
  );
}
