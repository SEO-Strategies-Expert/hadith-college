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
            <span className="brand-copy"><b>كلية الحديث وعلومه</b><small>منصة الإنتاج</small></span>
          </Link>
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
              <span className="eyebrow">Academic Core MVP</span>
              <h1>{title}</h1>
              <p className="muted">{subtitle}</p>
            </div>
            <span className="tag demo">{badge}</span>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
