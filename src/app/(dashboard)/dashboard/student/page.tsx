import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatusPanels } from "@/components/dashboard/StatusPanels";
import { dashboardModules } from "@/lib/demo-data";

export default function StudentDashboardPage() {
  return (
    <DashboardLayout title="لوحة الطالب" subtitle="واجهة أولية للمقررات والواجبات والدرجات والشهادات، قبل تفعيل التسجيل والصلاحيات." modules={dashboardModules.student}>
      <StatusPanels items={dashboardModules.student} />
    </DashboardLayout>
  );
}
