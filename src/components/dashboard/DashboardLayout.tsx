import Image from "next/image";
import Link from "next/link";

export type DashboardModule = string | { label: string; href: string; group?: string };

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
          <Link className="brand dashboard-brand" href="/">
            <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" src="/brand/hadith-college-logo-128.png" width={60} height={60} loading="eager" />
            <span className="brand-copy"><b>كلية الحديث وعلومه</b><small>البوابة الأكاديمية</small></span>
          </Link>
          <nav className="nav">
            {modules.map((module, index) => {
              const label = typeof module === "string" ? module : module.label;
              const href = typeof module === "string" ? `#module-${index}` : module.href;
              const group = typeof module === "string" ? undefined : module.group;
              const previous = index > 0 && typeof modules[index - 1] !== "string" ? modules[index - 1] as { group?: string } : undefined;
              return <div key={`${href}-${label}`}>{group && group !== previous?.group ? <div className="nav-label">{group}</div> : null}<Link className={index === 0 ? "active" : ""} href={href}><span className="ico" aria-hidden="true">◇</span>{label}</Link></div>;
            })}
          </nav>
        </aside>
        <main className="dashboard-main">
          <header className="dash-header">
            <div>
              <div className="dashboard-breadcrumbs"><Link href="/">الموقع العام</Link><span>/</span><span>لوحة التحكم</span></div>
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
