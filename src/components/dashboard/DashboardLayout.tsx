import Image from "next/image";
import Link from "next/link";

export type DashboardModule = string | { label: string; href: string };

export function DashboardLayout({
  title,
  subtitle,
  modules,
  children,
  badge = "Supabase Connected"
}: {
  title: string;
  subtitle: string;
  modules: DashboardModule[];
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="dashboard-layout-next">
      <div className="dashboard-shell">
        <aside className="sidebar">
          <Link className="brand" href="/">
            <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" src="/brand/hadith-college-logo-128.png" width={64} height={64} loading="eager" />
            <span className="dash-brand-copy"><b>كلية الحديث وعلومه</b><small>للرواية والدراية والتحقيق</small></span>
          </Link>
          <div className="role-card">
            <span className="avatar" aria-hidden="true">ح</span>
            <span><b>{title}</b><small>{badge}</small></span>
          </div>
          <div className="nav-label">القائمة الرئيسية</div>
          <nav className="nav">
            {modules.map((module, index) => {
              const label = typeof module === "string" ? module : module.label;
              const href = typeof module === "string" ? `#module-${index}` : module.href;
              return <Link className={index === 0 ? "active" : ""} href={href} key={`${href}-${label}`}><span className="ico">▧</span>{label}</Link>;
            })}
          </nav>
        </aside>
        <main className="dashboard-main">
          <header className="dash-header">
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <span className="tag demo">{badge}</span>
          </header>
          <div className="dashboard-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
