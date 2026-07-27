import Image from "next/image";
import Link from "next/link";
import { managementNavigation, type ManagementNavChild, type ManagementNavItem } from "@/lib/public-navigation";

const firstRow = managementNavigation.slice(0, 9);
const secondRow = managementNavigation.slice(9);

function DisabledItem({ item }: { item: ManagementNavChild }) {
  return (
    <span aria-disabled="true" className="dropdown-disabled" role="link" title="سيتم إضافة الرابط من إدارة الكلية">
      {item.icon ? <span className="nav-platform-icon" aria-hidden="true">{item.icon}</span> : null}
      {item.label}
    </span>
  );
}

function NavigationItem({ item }: { item: ManagementNavItem }) {
  if (item.children) {
    return (
      <li className={item.university ? "university-nav-item" : undefined}>
        <details className="simple-dropdown">
          <summary className="nav-link-button">
            {item.university ? <Image alt="" aria-hidden="true" className="university-nav-logo" src="/brand/aboubacar-ibrahim-university-icon-64.png" width={28} height={28} /> : null}
            {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
            {item.label}
          </summary>
          <div className="simple-dropdown-menu">
            {item.href && !item.children.some((child) => child.href === item.href) ? <Link href={item.href}>نظرة عامة</Link> : null}
            {item.children.map((child) => child.disabled ? <DisabledItem item={child} key={child.label} /> : <Link href={child.href!} key={child.label}>{child.icon ? <span className="nav-platform-icon" aria-hidden="true">{child.icon}</span> : null}{child.label}</Link>)}
          </div>
        </details>
      </li>
    );
  }

  return (
    <li>
      <Link className={`${item.featured ? "student-login-nav" : ""} ${item.icon ? "broadcast-nav" : ""}`} href={item.href!}>
        {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}{item.label}
      </Link>
    </li>
  );
}

export function Header() {
  const mobileItems = [managementNavigation[8], ...managementNavigation.filter((_, index) => index !== 8)];
  return (
    <>
      <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
      <div className="topbar">
        <div className="container">
          <span>كلية متخصصة في الرواية والدراية والتحقيق</span>
          <div className="topbar-links"><Link href="/live">البث</Link><Link href="/dashboard/student">دخول الطالب</Link></div>
        </div>
      </div>
      <header className="site-header">
        <div className="container legacy-brand-row">
          <Link aria-label="كلية الحديث وعلومه - الصفحة الرئيسية" className="brand" href="/">
            <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" src="/brand/hadith-college-logo-128.png" width={64} height={64} loading="eager" />
            <span className="brand-copy"><b>كلية الحديث وعلومه</b><small>للرواية والدراية والتحقيق</small></span>
          </Link>
          <Link className="university-lockup" href="/about/university">
            <Image alt="شعار جامعة أبو بكر إبراهيم" src="/brand/aboubacar-ibrahim-university-icon-64.png" width={52} height={52} />
            <span><small>الجامعة</small><b>جامعة أبو بكر إبراهيم</b></span>
          </Link>
          <details className="management-mobile-nav">
            <summary aria-label="فتح القائمة">☰ القائمة</summary>
            <nav aria-label="التنقل الرئيسي للجوال" className="mobile-management-drawer">
              {mobileItems.map((item) => item.children ? (
                <details key={item.label}>
                  <summary>{item.university ? <Image alt="" aria-hidden="true" src="/brand/aboubacar-ibrahim-university-icon-64.png" width={28} height={28} /> : null}{item.label}</summary>
                  {item.href ? <Link href={item.href}>نظرة عامة</Link> : null}
                  {item.children.map((child) => child.disabled ? <DisabledItem item={child} key={child.label} /> : <Link href={child.href!} key={child.label}>{child.label}</Link>)}
                </details>
              ) : <Link className={item.featured ? "mobile-student-login" : undefined} href={item.href!} key={item.label}>{item.icon ? <span aria-hidden="true">{item.icon}</span> : null}{item.label}</Link>)}
            </nav>
          </details>
        </div>
        <nav aria-label="التنقل الرئيسي" className="management-desktop-nav">
          <div className="container management-nav-row management-nav-row-primary"><ul>{firstRow.map((item) => <NavigationItem item={item} key={item.label} />)}</ul></div>
          <div className="container management-nav-row management-nav-row-secondary"><ul>{secondRow.map((item) => <NavigationItem item={item} key={item.label} />)}</ul></div>
        </nav>
      </header>
    </>
  );
}
