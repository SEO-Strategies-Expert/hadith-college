export function StatusPanels({ items }: { items: string[] }) {
  return (
    <section className="dashboard-panel-grid">
      <article className="card">
        <div className="card-head"><div><h2>حالة الربط</h2><span className="muted small">سيتم استبدال هذه البيانات بـ Supabase بعد Phase 2.</span></div></div>
        <ul className="status-list">
          <li><span>قاعدة البيانات</span><b>Pending</b></li>
          <li><span>تسجيل الدخول</span><b>Pending</b></li>
          <li><span>RLS</span><b>Pending</b></li>
          <li><span>الملفات الخاصة</span><b>Pending</b></li>
        </ul>
      </article>
      <article className="card">
        <div className="card-head"><div><h2>الوحدات المنقولة</h2><span className="muted small">واجهات route shell أولية.</span></div></div>
        <div className="dashboard-grid">
          {items.slice(0, 6).map((item) => <div className="fee-admin-stat" key={item}><span>{item}</span><b style={{ fontSize: 18 }}>جاهز للربط</b><small>مصدر البيانات Demo</small></div>)}
        </div>
      </article>
    </section>
  );
}
