import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getStudentDashboard } from "@/lib/academic/academic-core";
import { getStudentTeachingDashboard } from "@/lib/academic/teaching-operations";
import { dashboardModules } from "@/lib/demo-data";
import Link from "next/link";

export default async function StudentDashboardPage() {
  const session = await requireDashboardUser("student");
  const dashboard = session ? await getStudentDashboard(session.user.id) : null;
  const teaching = session ? await getStudentTeachingDashboard(session.user.id) : null;
  const student = dashboard?.student;
  const enrollments = dashboard?.enrollments ?? [];

  return (
    <DashboardLayout title="لوحة الطالب" subtitle="محاضراتك، واجباتك، اختباراتك، حضورك ودرجاتك المنشورة من Supabase." modules={dashboardModules.student} badge="Teaching Operations MVP">
      {student ? (
        <>
          <section className="dashboard-panel-grid">
            <article className="card"><h2>{student.full_name_ar}</h2><p className="muted">{student.student_number} - {student.academic_status}</p><p>{student.academic_programs?.name_ar ?? "بدون برنامج"} / {student.program_levels?.name_ar ?? "بدون مستوى"}</p></article>
            <article className="card"><h2>محاضرات اليوم</h2><p className="metric">{teaching?.todayMeetings.length ?? 0}</p><span className="muted small">حسب الشعب المسجل فيها.</span></article>
            <article className="card"><h2>نسبة الحضور</h2><p className="metric">{teaching?.attendancePercentage ?? "-"}{teaching?.attendancePercentage !== null ? "%" : ""}</p><span className="muted small">من السجلات المنشورة.</span></article>
            <article className="card"><h2>متوسط الدرجات</h2><p className="metric">{teaching?.publishedGradeAverage ?? "-"}</p><span className="muted small">لا يشمل المسودات غير المنشورة.</span></article>
          </section>
          <section className="dashboard-panel-grid" style={{ marginTop: 16 }}>
            <article className="card">
              <h2>الواجبات القادمة</h2>
              <div className="record-grid">
                {(teaching?.upcomingAssignments ?? []).map((assignment) => (
                  <div className="mini-record" key={assignment.id}>
                    <b>{assignment.title}</b>
                    <span>{assignment.course_sections?.courses?.name_ar} / {assignment.due_at ? new Date(assignment.due_at).toLocaleString("ar-QA") : "بدون موعد"}</span>
                  </div>
                ))}
                {teaching?.upcomingAssignments.length === 0 ? <p className="notice">لا توجد واجبات قادمة.</p> : null}
              </div>
            </article>
            <article className="card">
              <h2>الاختبارات المتاحة</h2>
              <div className="record-grid">
                {(teaching?.availableQuizzes ?? []).map((quiz) => (
                  <div className="mini-record" key={quiz.id}>
                    <b>{quiz.title}</b>
                    <span>{quiz.course_sections?.courses?.name_ar} / {quiz.available_until ? new Date(quiz.available_until).toLocaleString("ar-QA") : "مفتوح"}</span>
                  </div>
                ))}
                {teaching?.availableQuizzes.length === 0 ? <p className="notice">لا توجد اختبارات متاحة.</p> : null}
              </div>
            </article>
          </section>
          <section className="dashboard-panel-grid" style={{ marginTop: 16 }}>
            <article className="card">
              <h2>الإعلانات</h2>
              <div className="record-grid">
                {(teaching?.announcements ?? []).map((announcement) => (
                  <Link className="mini-record" href="/dashboard/student/announcements" key={announcement.id}>
                    <b>{announcement.title}</b>
                    <span>{announcement.priority} / {announcement.course_sections?.section_code ?? "عام"}</span>
                  </Link>
                ))}
                {teaching?.announcements.length === 0 ? <p className="notice">لا توجد إعلانات جديدة.</p> : null}
              </div>
            </article>
            <article className="card">
              <h2>التنبيهات</h2>
              <div className="record-grid">
                {(teaching?.notifications ?? []).map((notification) => (
                  <div className="mini-record" key={notification.id}>
                    <b>{notification.title}</b>
                    <span>{notification.body ?? new Date(notification.created_at).toLocaleString("ar-QA")}</span>
                  </div>
                ))}
                {teaching?.notifications.length === 0 ? <p className="notice">لا توجد تنبيهات حالية.</p> : null}
              </div>
            </article>
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
