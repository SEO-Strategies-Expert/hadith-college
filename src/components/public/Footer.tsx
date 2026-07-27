import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-brand-lockup">
            <Image alt="شعار كلية الحديث وعلومه" className="footer-logo" src="/brand/hadith-college-logo-128.png" width={84} height={84} />
            <div className="footer-brand-name"><b>كلية الحديث وعلومه</b><span>جامعة أبو بكر إبراهيم</span></div>
          </div>
          <p>بيئة علمية رقمية تجمع تعليم الحديث المتدرج، والتخريج التطبيقي، والتحقيق العلمي للمخطوطات في تجربة عربية أصيلة ومعاصرة.</p>
        </div>
        <div><h4>الكلية</h4><ul><li><Link href="/about">نبذة عن الكلية</Link></li><li><Link href="/about/mission-vision">الرسالة والرؤية</Link></li><li><Link href="/scientific-body">الهيئة العلمية</Link></li><li><Link href="/news">الأخبار</Link></li></ul></div>
        <div><h4>الدراسة</h4><ul><li><Link href="/programs">البرامج الأكاديمية</Link></li><li><Link href="/diplomas">الدبلومات</Link></li><li><Link href="/courses">الدورات</Link></li><li><Link href="/curricula">المناهج</Link></li><li><Link href="/fees">الرسوم</Link></li></ul></div>
        <div><h4>البحث والنشر</h4><ul><li><Link href="/research/takhrij-lab">مختبر التخريج</Link></li><li><Link href="/research/hadith-sites">المواقع البحثية</Link></li><li><Link href="/research/peer-reviewed">الأبحاث المحكمة</Link></li><li><Link href="/journal">المجلة العلمية</Link></li><li><Link href="/store">الكتب والكورسات</Link></li></ul></div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 كلية الحديث وعلومه. جميع الحقوق محفوظة.</span>
        <Link href="/about/university">جامعة أبو بكر إبراهيم</Link>
      </div>
    </footer>
  );
}
