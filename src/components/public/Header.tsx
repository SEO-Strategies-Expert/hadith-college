import Image from "next/image";
import Link from "next/link";
import { publicNavigation } from "@/lib/public-navigation";

export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
      <div className="institution-bar">
        <div className="container">
          <span>كلية الحديث وعلومه</span>
          <Link href="/about/university">جامعة أبو بكر إبراهيم</Link>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link aria-label="كلية الحديث وعلومه - الصفحة الرئيسية" className="brand" href="/">
            <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" src="/brand/hadith-college-logo-128.png" width={64} height={64} loading="eager" />
            <span className="brand-copy">
              <b>كلية الحديث وعلومه</b>
              <small>جامعة أبو بكر إبراهيم</small>
            </span>
          </Link>
          <nav aria-label="التنقل الرئيسي" className="desktop-navigation">
            <ul className="nav-links">
              {publicNavigation.map((group) => (
                <li key={group.href}>
                  {group.items ? (
                    <details>
                      <summary className="nav-link-button">{group.label}</summary>
                      <div className={`mega-menu ${group.items.length > 4 ? "mega-menu-wide" : ""}`}>
                        <Link className="mega-overview" href={group.href}>نظرة عامة</Link>
                        {group.items.map((item) => <Link href={item.href} key={item.href}><span><b>{item.label}</b>{item.description ? <small>{item.description}</small> : null}</span></Link>)}
                      </div>
                    </details>
                  ) : <Link href={group.href}>{group.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav-actions">
            <Link className="btn live-action" href="/live">البث المباشر</Link>
            <Link className="btn primary" href="/dashboard/student">دخول الطالب</Link>
            <details className="mobile-navigation">
              <summary aria-label="فتح القائمة">القائمة</summary>
              <div className="mobile-drawer">
                <div className="mobile-actions">
                  <Link className="btn primary" href="/dashboard/student">دخول الطالب</Link>
                  <Link className="btn live-action" href="/live">البث المباشر</Link>
                </div>
                <nav aria-label="التنقل الرئيسي للجوال">
                  {publicNavigation.map((group) => group.items ? (
                    <details className="mobile-nav-group" key={group.href}>
                      <summary>{group.label}</summary>
                      <Link href={group.href}>نظرة عامة</Link>
                      {group.items.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
                    </details>
                  ) : <Link className="mobile-direct-link" href={group.href} key={group.href}>{group.label}</Link>)}
                </nav>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
