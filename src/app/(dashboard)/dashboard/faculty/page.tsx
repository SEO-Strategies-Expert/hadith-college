import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getFacultyCoursesForUser } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";
import Link from "next/link";

export default async function FacultyDashboardPage() {
  const session = await requireDashboardUser("faculty");
  const sections = session ? await getFacultyCoursesForUser(session.user.id) : [];
  return (
    <DashboardLayout title="لوحة هيئة التدريس" subtitle="مقررات مسندة فعليًا من Supabase مع إدارة الدروس داخل نطاق المدرس فقط." modules={dashboardModules.faculty}>
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
