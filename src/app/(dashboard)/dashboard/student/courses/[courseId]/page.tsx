import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getStudentDashboard } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";

export default async function StudentCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const session = await requireDashboardUser("student");
  const { courseId } = await params;
  const dashboard = session ? await getStudentDashboard(session.user.id) : null;
  const enrollment = (dashboard?.enrollments ?? []).find((item: { course_sections?: { id: string } | null }) => item.course_sections?.id === courseId);

  if (!enrollment) {
    return <DashboardLayout title="مقرر غير متاح" subtitle="الطالب يرى فقط مقررات الشعب المسجل بها." modules={dashboardModules.student}><p className="notice">لا يوجد تسجيل نشط لهذا المقرر.</p></DashboardLayout>;
  }

  const section = enrollment.course_sections;
  const modules = section?.course_modules ?? [];

  return (
    <DashboardLayout title={section?.courses?.name_ar ?? "المقرر"} subtitle={`الشعبة ${section?.section_code}`} modules={dashboardModules.student}>
      <section className="card record-grid">
        {modules.map((module: { id: string; title_ar: string; lessons?: Array<{ id: string; title_ar: string; status: string }> }) => (
          <article className="mini-record" key={module.id}>
            <b>{module.title_ar}</b>
            {(module.lessons ?? []).filter((lesson) => lesson.status === "published").map((lesson) => (
              <Link className="text-link" href={`/dashboard/student/courses/${courseId}/lessons/${lesson.id}`} key={lesson.id}>{lesson.title_ar}</Link>
            ))}
          </article>
        ))}
      </section>
    </DashboardLayout>
  );
}
