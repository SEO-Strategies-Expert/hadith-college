import { updateStudentStatus, upsertStudentProfile } from "@/actions/students";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { getSelectOptions, listStudents } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";

const statuses = ["applicant", "accepted", "active", "suspended", "withdrawn", "graduated", "archived"];

export default async function AdminStudentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireDashboardUser("admin");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status = typeof params.status === "string" ? params.status : "";
  const [students, options] = await Promise.all([listStudents({ q, status }), getSelectOptions()]);
  const csv = ["student_number,full_name_ar,email,academic_status", ...students.map((student: { student_number: string; full_name_ar: string; email: string; academic_status: string }) => `${student.student_number},${student.full_name_ar},${student.email},${student.academic_status}`)].join("\n");

  return (
    <DashboardLayout title="إدارة الطلاب" subtitle="ملفات الطلاب، الدعوات، الحالات الأكاديمية، البحث، التصفية، CSV Import/Export مبدئي." modules={dashboardModules.admin}>
      <section className="dashboard-panel-grid">
        <article className="card">
          <div className="card-head"><div><h2>إضافة طالب</h2><span className="muted small">استخدم Invite/Magic Link فقط.</span></div></div>
          <form action={upsertStudentProfile} className="form-grid">
            <div className="field"><label>رقم الطالب</label><input className="form-control" name="student_number" required /></div>
            <div className="field"><label>الاسم العربي</label><input className="form-control" name="full_name_ar" required /></div>
            <div className="field"><label>البريد</label><input className="form-control" name="email" type="email" required /></div>
            <div className="field"><label>الهاتف</label><input className="form-control" name="phone" /></div>
            <div className="field"><label>الجنسية</label><input className="form-control" name="nationality" /></div>
            <div className="field"><label>الدولة</label><input className="form-control" name="country" /></div>
            <div className="field"><label>المؤهل</label><input className="form-control" name="qualification" /></div>
            <div className="field"><label>البرنامج</label><select className="form-control" name="program_id"><option value="">بدون</option>{options.programs.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label>المستوى</label><select className="form-control" name="current_level_id"><option value="">بدون</option>{options.levels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
            <div className="field"><label>الحالة الأكاديمية</label><select className="form-control" name="academic_status">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="field full"><label>ملاحظات</label><textarea className="form-control" name="notes" rows={3} /></div>
            <label className="check-line"><input name="invite" type="checkbox" /> دعوة حساب الطالب بالبريد</label>
            <div className="field"><button className="btn gold" type="submit">حفظ الطالب</button></div>
          </form>
        </article>
        <article className="card">
          <div className="card-head"><div><h2>بحث وتصدير</h2><span className="muted small">{students.length} طالب.</span></div></div>
          <form className="form-grid">
            <div className="field"><label>بحث</label><input className="form-control" name="q" defaultValue={q} /></div>
            <div className="field"><label>الحالة</label><select className="form-control" name="status" defaultValue={status}><option value="">كل الحالات</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
            <button className="btn ghost" type="submit">تطبيق</button>
          </form>
          <textarea className="form-control" readOnly rows={7} value={csv} />
          <p className="muted small">CSV Import مبدئي: استخدم نفس الأعمدة في نموذج الإضافة أو ارفعه عبر سكربت لاحق.</p>
        </article>
      </section>
      <section className="card">
        <div className="record-grid">
          {students.map((student: { id: string; student_number: string; full_name_ar: string; email: string; academic_status: string; fee_status: string; academic_programs?: { name_ar: string } | null }) => (
            <article className="mini-record" key={student.id}>
              <b>{student.student_number} - {student.full_name_ar}</b>
              <span>{student.email} - {student.academic_programs?.name_ar ?? "بدون برنامج"}</span>
              <small>رسوم: {student.fee_status}</small>
              <form action={updateStudentStatus} className="inline-form">
                <input name="id" type="hidden" value={student.id} />
                <select name="academic_status" defaultValue={student.academic_status}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
                <button type="submit">تحديث</button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
