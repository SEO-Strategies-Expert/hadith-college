import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatusPanels } from "@/components/dashboard/StatusPanels";
import { dashboardModules } from "@/lib/demo-data";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="لوحة مدير الكلية" subtitle="Route shell أولي يحافظ على بنية اللوحة الحالية قبل ربط Supabase والصلاحيات." modules={dashboardModules.admin}>
      <StatusPanels items={dashboardModules.admin} />
    </DashboardLayout>
  );
}
