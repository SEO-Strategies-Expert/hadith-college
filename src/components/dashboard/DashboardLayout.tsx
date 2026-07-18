import Image from "next/image";
import Link from "next/link";

export function DashboardLayout({ title, subtitle, modules, children }: { title: string; subtitle: string; modules: string[]; children: React.ReactNode }) {
  return (
    <div className="dashboard-layout-next">
      <div className="dashboard-shell">
        <aside className="sidebar">
          <Link className="brand" href="/">
            <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" src="/assets/img/logo-official.png" width={64} height={64} />
            <span className="brand-copy"><b>كلية الحديث وعلومه</b><small>منصة الإنتاج</small></span>
          </Link>
          <div className="nav-label">القائمة الرئيسية</div>
          <nav className="nav">
            {modules.map((module, index) => <a className={index === 0 ? "active" : ""} href={`#module-${index}`} key={module}><span className="ico">▧</span>{module}</a>)}
          </nav>
        </aside>
        <main className="dashboard-main">
          <header className="dash-header">
            <div>
              <span className="eyebrow">Phase 1 Route Shell</span>
              <h1>{title}</h1>
              <p className="muted">{subtitle}</p>
            </div>
            <span className="tag demo">Demo / Not Connected</span>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
