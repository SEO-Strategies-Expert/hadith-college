import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatusPanels } from "@/components/dashboard/StatusPanels";
import { dashboardModules } from "@/lib/demo-data";
import Link from "next/link";

export default function AdminDashboardPage() {
  const quickLinks = [
    ["/dashboard/admin/users", "إدارة المستخدمين"],
    ["/dashboard/admin/faculty", "هيئة التدريس"],
    ["/dashboard/admin/students", "الطلاب"],
    ["/dashboard/admin/academic/programs", "البرامج"],
    ["/dashboard/admin/academic/courses", "المقررات"],
    ["/dashboard/admin/academic/sections", "الشعب والتسجيل"]
  ];

  return (
    <DashboardLayout title="لوحة مدير الكلية" subtitle="Academic Core MVP متصل بقاعدة Supabase: مستخدمون، طلاب، هيئة، برامج، مقررات، وشعب." modules={dashboardModules.admin}>
      <section className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div><h2>إدارة المحتوى</h2><span className="muted small">CMS الصفحة الرئيسية، ثم مسارات Academic Core.</span></div>
          <Link className="primary-btn" href="/dashboard/admin/content/home">تحرير Hero</Link>
        </div>
      </section>
      <section className="record-grid" style={{ marginBottom: 16 }}>
        {quickLinks.map(([href, label]) => <Link className="mini-record" href={href} key={href}><b>{label}</b><span>فتح اللوحة</span></Link>)}
      </section>
      <StatusPanels items={dashboardModules.admin} />
    </DashboardLayout>
  );
}
