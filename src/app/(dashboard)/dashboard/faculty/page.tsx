import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatusPanels } from "@/components/dashboard/StatusPanels";
import { dashboardModules } from "@/lib/demo-data";

export default function FacultyDashboardPage() {
  return (
    <DashboardLayout title="لوحة هيئة التدريس" subtitle="واجهة أولية للمقررات والدروس والبث والتصحيح، دون بيانات حقيقية بعد." modules={dashboardModules.faculty}>
      <StatusPanels items={dashboardModules.faculty} />
    </DashboardLayout>
  );
}
