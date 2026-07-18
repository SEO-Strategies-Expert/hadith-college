import type { DashboardModule } from "./DashboardLayout";

export function StatusPanels({ items }: { items: DashboardModule[] }) {
  return (
    <section className="dashboard-panel-grid">
      <article className="card">
        <div className="card-head"><div><h2>حالة الربط</h2><span className="muted small">Academic Core MVP متصل بقاعدة Supabase عند تهيئة البيئة.</span></div></div>
        <ul className="status-list">
          <li><span>قاعدة البيانات</span><b>Ready</b></li>
          <li><span>تسجيل الدخول</span><b>Magic Link</b></li>
          <li><span>RLS</span><b>Enabled</b></li>
          <li><span>الملفات الخاصة</span><b>Policies</b></li>
        </ul>
      </article>
      <article className="card">
        <div className="card-head"><div><h2>الوحدات المنقولة</h2><span className="muted small">روابط مباشرة للوظائف الحالية.</span></div></div>
        <div className="dashboard-grid">
          {items.slice(0, 6).map((item) => {
            const label = typeof item === "string" ? item : item.label;
            return <div className="fee-admin-stat" key={label}><span>{label}</span><b style={{ fontSize: 18 }}>MVP</b><small>Supabase-backed</small></div>;
          })}
        </div>
      </article>
    </section>
  );
}
