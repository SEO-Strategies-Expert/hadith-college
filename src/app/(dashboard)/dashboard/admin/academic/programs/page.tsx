import { createProgramLevel, updateProgramStatus, upsertProgram } from "@/actions/academic";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { dashboardModules } from "@/lib/demo-data";
import { listPrograms } from "@/lib/academic/academic-core";
import Link from "next/link";

const statuses = ["draft", "pending_review", "published", "archived"];

export default async function AdminProgramsPage() {
  await requireDashboardUser("admin");
  const programs = await listPrograms();

  return (
    <DashboardLayout title="البرامج الأكاديمية" subtitle="إنشاء وتعديل ونشر وربط المستويات والمقررات، مع ظهور المنشور في الموقع العام." modules={dashboardModules.admin}>
      <section className="card">
        <div className="card-head"><div><h2>إنشاء برنامج</h2><span className="muted small">البرامج المنشورة فقط تظهر للزائر.</span></div><Link className="primary-btn" href="/programs">معاينة عامة</Link></div>
        <form action={upsertProgram} className="form-grid">
          <div className="field"><label>الاسم العربي</label><input className="form-control" name="name_ar" required /></div>
          <div className="field"><label>Slug</label><input className="form-control" name="slug" required /></div>
          <div className="field"><label>الاسم الإنجليزي</label><input className="form-control" name="name_en" /></div>
          <div className="field"><label>نوع البرنامج</label><input className="form-control" name="program_type" /></div>
          <div className="field"><label>نوع المؤهل</label><input className="form-control" name="qualification_type" /></div>
          <div className="field"><label>المدة</label><input className="form-control" name="duration_text" /></div>
          <div className="field"><label>عدد المستويات</label><input className="form-control" name="number_of_levels" type="number" /></div>
          <div className="field"><label>الساعات</label><input className="form-control" name="credit_hours" type="number" /></div>
          <div className="field full"><label>وصف مختصر</label><textarea className="form-control" name="short_description" rows={2} /></div>
          <div className="field full"><label>الوصف الكامل</label><textarea className="form-control" name="full_description" rows={4} /></div>
          <div className="field"><label>لغة الدراسة</label><input className="form-control" name="study_language" defaultValue="العربية" /></div>
          <div className="field"><label>نمط الدراسة</label><input className="form-control" name="study_mode" defaultValue="online" /></div>
          <div className="field full"><label>شروط القبول</label><textarea className="form-control" name="admission_requirements" rows={2} /></div>
          <div className="field full"><label>مخرجات التعلم</label><textarea className="form-control" name="learning_outcomes" rows={2} /></div>
          <div className="field"><label>الشهادة</label><input className="form-control" name="certificate_type" /></div>
          <div className="field"><label>الحالة</label><select className="form-control" name="status">{statuses.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>الترتيب</label><input className="form-control" name="sort_order" type="number" defaultValue={0} /></div>
          <label className="check-line"><input name="is_featured" type="checkbox" /> مميز</label>
          <button className="btn gold" type="submit">حفظ البرنامج</button>
        </form>
      </section>
      <section className="card">
        <div className="record-grid">
          {programs.map((program: { id: string; name_ar: string; slug: string; short_description: string | null; status: string; program_levels?: Array<{ id: string; name_ar: string; level_number: number }> }) => (
            <article className="mini-record" key={program.id}>
              <b>{program.name_ar}</b>
              <span>/{program.slug} - {program.short_description}</span>
              <small>المستويات: {(program.program_levels ?? []).map((level) => `${level.level_number}. ${level.name_ar}`).join("، ") || "لا توجد"}</small>
              <form action={updateProgramStatus} className="inline-form"><input name="id" type="hidden" value={program.id} /><select name="status" defaultValue={program.status}>{statuses.map((item) => <option key={item}>{item}</option>)}</select><button type="submit">نشر/أرشفة</button></form>
              <form action={createProgramLevel} className="inline-form"><input name="program_id" type="hidden" value={program.id} /><input name="level_number" placeholder="رقم" type="number" /><input name="name_ar" placeholder="اسم المستوى" /><button type="submit">إضافة مستوى</button></form>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
