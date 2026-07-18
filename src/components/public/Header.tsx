import Image from "next/image";
import Link from "next/link";

const programLinks = [
  ["الدبلوم التأسيسي", "/programs/foundation"],
  ["التخريج ودراسة الأسانيد", "/programs/takhrij"],
  ["التحقيق وعلوم المخطوطات", "/programs/manuscripts"],
  ["المسار العالي", "/programs/higher"]
];

const knowledgeLinks = [
  ["مختبر التخريج", "/takhrij-lab"],
  ["مختبر التحقيق", "/manuscripts-lab"],
  ["المكتبة الرقمية", "/library"],
  ["المواقع الحديثية البحثية", "/research-sites"],
  ["منطقة الطالب", "/dashboard/student"]
];

export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
      <div className="topbar">
        <div className="container">
          <span>كلية متخصصة في الرواية والدراية والتحقيق</span>
          <div className="topbar-links">
            <Link href="/publications">مجلة الكلية</Link>
            <Link href="/dashboard/student">دخول الطالب</Link>
            <Link href="/contact">الدعم والتواصل</Link>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-wrap">
          <Link aria-label="كلية الحديث وعلومه - الصفحة الرئيسية" className="brand" href="/">
            <Image alt="شعار كلية الحديث وعلومه" className="brand-emblem" src="/assets/img/logo-official.png" width={72} height={72} priority />
            <span className="brand-copy">
              <b>كلية الحديث وعلومه</b>
              <small>للرواية والدراية والتحقيق</small>
            </span>
          </Link>
          <nav aria-label="التنقل الرئيسي">
            <ul className="nav-links">
              <li><Link href="/">الرئيسية</Link></li>
              <li><Link href="/about">عن الكلية</Link></li>
              <li>
                <details>
                  <summary className="nav-link-button">البرامج</summary>
                  <div className="mega-menu">
                    {programLinks.map(([label, href]) => <Link href={href} key={href}><span><b>{label}</b><small>مسار أكاديمي قابل للإدارة من لوحة التحكم لاحقًا</small></span></Link>)}
                  </div>
                </details>
              </li>
              <li>
                <details>
                  <summary className="nav-link-button">المختبرات والمكتبة</summary>
                  <div className="mega-menu">
                    {knowledgeLinks.map(([label, href]) => <Link href={href} key={href}><span><b>{label}</b><small>واجهة مرحلة أولى قبل ربط قاعدة البيانات</small></span></Link>)}
                  </div>
                </details>
              </li>
              <li><Link href="/faculty">الهيئة العلمية</Link></li>
              <li><Link href="/publications">الإصدارات</Link></li>
              <li><Link href="/news">الأخبار</Link></li>
            </ul>
          </nav>
          <div className="nav-actions">
            <Link className="btn ghost" href="/dashboard/student">دخول الطالب</Link>
            <Link className="btn gold" href="/admissions">قدّم الآن</Link>
          </div>
        </div>
      </header>
    </>
  );
}
