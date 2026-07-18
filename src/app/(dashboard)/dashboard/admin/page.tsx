import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatusPanels } from "@/components/dashboard/StatusPanels";
import { dashboardModules } from "@/lib/demo-data";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="لوحة مدير الكلية" subtitle="Route shell أولي يحافظ على بنية اللوحة الحالية قبل ربط Supabase والصلاحيات." modules={dashboardModules.admin}>
      <section className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div><h2>إدارة المحتوى</h2><span className="muted small">أول دورة CMS للصفحة الرئيسية.</span></div>
          <Link className="primary-btn" href="/dashboard/admin/content/home">تحرير Hero</Link>
        </div>
      </section>
      <StatusPanels items={dashboardModules.admin} />
    </DashboardLayout>
  );
}
