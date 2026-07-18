import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getStudentDashboard } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await requireDashboardUser("student");
  const dashboard = session ? await getStudentDashboard(session.user.id) : null;
  const student = dashboard?.student;
  const enrollments = dashboard?.enrollments ?? [];

  return (
    <DashboardLayout title="لوحة الطالب" subtitle="بيانات الطالب وتسجيلاته وتقدمه من Supabase." modules={dashboardModules.student}>
      {student ? (
        <>
          <section className="dashboard-panel-grid">
            <article className="card"><h2>{student.full_name_ar}</h2><p className="muted">{student.student_number} - {student.academic_status}</p><p>{student.academic_programs?.name_ar ?? "بدون برنامج"} / {student.program_levels?.name_ar ?? "بدون مستوى"}</p></article>
            <article className="card"><h2>المحاضرات القادمة</h2><p className="muted">Placeholder منظم للمرحلة التالية: البث والتقويم.</p></article>
          </section>
          <section className="card record-grid">
            {enrollments.map((enrollment: { id: string; course_sections?: { id: string; section_code: string; courses?: { code: string; name_ar: string } | null; course_modules?: unknown[] } | null }) => (
              <article className="mini-record" key={enrollment.id}>
                <b>{enrollment.course_sections?.courses?.code} - {enrollment.course_sections?.courses?.name_ar}</b>
                <span>الشعبة: {enrollment.course_sections?.section_code}</span>
                <Link className="text-link" href={`/dashboard/student/courses/${enrollment.course_sections?.id}`}>فتح المقرر</Link>
              </article>
            ))}
          </section>
        </>
      ) : <p className="notice">لم يتم ربط حسابك بملف طالب بعد.</p>}
    </DashboardLayout>
  );
}
