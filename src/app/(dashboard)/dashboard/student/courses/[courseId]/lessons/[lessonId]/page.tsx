import { markLessonProgress } from "@/actions/learning";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getStudentDashboard } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";

type LessonRow = { id: string; title_ar: string; content_text?: string | null; video_url?: string | null; pdf_url?: string | null };

export default async function StudentLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const session = await requireDashboardUser("student");
  const { courseId, lessonId } = await params;
  const dashboard = session ? await getStudentDashboard(session.user.id) : null;
  const enrollment = (dashboard?.enrollments ?? []).find((item: { course_sections?: { id: string } | null }) => item.course_sections?.id === courseId);
  const lesson = enrollment?.course_sections?.course_modules
    ?.flatMap((module: { lessons?: LessonRow[] }) => module.lessons ?? [])
    .find((item) => item.id === lessonId);

  if (!lesson) {
    return <DashboardLayout title="درس غير متاح" subtitle="RLS يمنع فتح درس خارج تسجيل الطالب." modules={dashboardModules.student}><p className="notice">لا يمكنك فتح هذا الدرس.</p></DashboardLayout>;
  }

  return (
    <DashboardLayout title={lesson.title_ar} subtitle="تقدم الدرس يحفظ في Supabase." modules={dashboardModules.student}>
      <section className="card prose">
        <p>{lesson.content_text ?? "لا يوجد نص درس بعد."}</p>
        {lesson.video_url ? <p>الفيديو: {lesson.video_url}</p> : null}
        {lesson.pdf_url ? <p>PDF: {lesson.pdf_url}</p> : null}
        <form action={markLessonProgress} className="form-grid">
          <input name="lesson_id" type="hidden" value={lesson.id} />
          <div className="field"><label>نسبة التقدم</label><input className="form-control" name="progress_percentage" type="number" defaultValue={100} min={0} max={100} /></div>
          <div className="field"><label>آخر موضع</label><input className="form-control" name="last_position" /></div>
          <button className="btn gold" type="submit">حفظ التقدم</button>
        </form>
      </section>
    </DashboardLayout>
  );
}
