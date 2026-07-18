import { updateFacultyStatus, upsertFacultyProfile } from "@/actions/faculty";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { listFaculty } from "@/lib/academic/academic-core";
import { dashboardModules } from "@/lib/demo-data";

const statuses = ["draft", "pending_review", "published", "archived"];

export default async function AdminFacultyPage() {
  await requireDashboardUser("admin");
  const faculty = await listFaculty();

  return (
    <DashboardLayout title="إدارة هيئة التدريس" subtitle="CRUD حقيقي لملفات المدرسين، الربط بحساب Auth، النشر، والصورة والسيرة." modules={dashboardModules.admin}>
      <section className="card">
        <div className="card-head"><div><h2>إضافة عضو هيئة تدريس</h2><span className="muted small">عند إدخال بريد بدون user_id يتم إرسال دعوة بريدية وربط الحساب.</span></div></div>
        <form action={upsertFacultyProfile} className="form-grid">
          <div className="field"><label>الاسم العربي</label><input className="form-control" name="full_name_ar" required /></div>
          <div className="field"><label>Slug</label><input className="form-control" name="slug" required /></div>
          <div className="field"><label>البريد للدعوة</label><input className="form-control" name="email" type="email" /></div>
          <div className="field"><label>حساب Auth موجود</label><input className="form-control" name="user_id" /></div>
          <div className="field"><label>اللقب العلمي</label><input className="form-control" name="academic_title" /></div>
          <div className="field"><label>التخصص</label><input className="form-control" name="specialization" /></div>
          <div className="field"><label>الدرجة</label><input className="form-control" name="degree" /></div>
          <div className="field"><label>الجامعة</label><input className="form-control" name="university" /></div>
          <div className="field full"><label>نبذة قصيرة</label><textarea className="form-control" name="bio_short" rows={2} /></div>
          <div className="field full"><label>السيرة الكاملة</label><textarea className="form-control" name="bio_full" rows={4} /></div>
          <div className="field"><label>اللغات</label><input className="form-control" name="languages" placeholder="العربية, الإنجليزية" /></div>
          <div className="field"><label>البريد العام</label><input className="form-control" name="public_email" type="email" /></div>
          <div className="field"><label>مسار الصورة</label><input className="form-control" name="profile_image" placeholder="faculty-avatars/path.webp" /></div>
          <div className="field"><label>مسار CV</label><input className="form-control" name="cv_file" placeholder="public-assets/cv.pdf" /></div>
          <div className="field"><label>الحالة</label><select className="form-control" name="status">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>الترتيب</label><input className="form-control" name="sort_order" type="number" defaultValue={0} /></div>
          <label className="check-line"><input name="is_featured" type="checkbox" /> مميز</label>
          <div className="field"><button className="btn gold" type="submit">حفظ العضو</button></div>
        </form>
      </section>
      <section className="card">
        <div className="card-head"><div><h2>الأعضاء</h2><span className="muted small">{faculty.length} ملف.</span></div></div>
        <div className="record-grid">
          {faculty.map((item: { id: string; full_name_ar: string; academic_title: string | null; specialization: string | null; status: string; sort_order: number; public_email: string | null }) => (
            <article className="mini-record" key={item.id}>
              <b>{item.full_name_ar}</b>
              <span>{item.academic_title ?? "عضو هيئة تدريس"} - {item.specialization ?? "تخصص غير محدد"}</span>
              <small>{item.public_email ?? "بلا بريد عام"} - ترتيب {item.sort_order}</small>
              <form action={updateFacultyStatus} className="inline-form">
                <input name="id" type="hidden" value={item.id} />
                <select name="status" defaultValue={item.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
                <button type="submit">تحديث النشر</button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
