import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-brand-lockup">
            <Image alt="شعار كلية الحديث وعلومه" className="footer-logo" src="/brand/hadith-college-logo-128.png" width={76} height={76} />
            <div className="footer-brand-name"><b>كلية الحديث وعلومه</b><span>للرواية والدراية والتحقيق</span></div>
          </div>
          <p>بيئة علمية رقمية تجمع تعليم الحديث المتدرج، والتخريج التطبيقي، والتحقيق العلمي للمخطوطات في تجربة عربية أصيلة ومعاصرة.</p>
        </div>
        <div><h4>الكلية</h4><ul><li><Link href="/about">عن الكلية</Link></li><li><Link href="/about/mission-vision">الرؤية والرسالة</Link></li><li><Link href="/scientific-body/faculty">أعضاء هيئة التدريس</Link></li><li><Link href="/news">الأخبار</Link></li></ul></div>
        <div><h4>الدراسة</h4><ul><li><Link href="/programs">البرامج الأكاديمية</Link></li><li><Link href="/diplomas">الدبلومات</Link></li><li><Link href="/courses">الدورات القصيرة</Link></li><li><Link href="/curricula">مناهج الدراسة</Link></li><li><Link href="/fees">الرسوم</Link></li></ul></div>
        <div><h4>البحث والنشر</h4><ul><li><Link href="/research/takhrij-lab">مختبر التخريج</Link></li><li><Link href="/research/hadith-sites">المواقع الحديثية</Link></li><li><Link href="/journal/research">أبحاث المجلة</Link></li><li><Link href="/research/peer-reviewed">الأبحاث المحكمة</Link></li></ul></div>
        <div className="footer-university">
          <Image alt="شعار جامعة أبو بكر إبراهيم" src="/brand/aboubacar-ibrahim-university-logo-128.png" width={88} height={88} />
          <div><h4>جامعة أبو بكر إبراهيم</h4><Link href="/about/university">صفحة الجامعة</Link><p className="small">روابط المنصة والتواصل بانتظار إدخالها من الإدارة.</p></div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 كلية الحديث وعلومه. جميع الحقوق محفوظة.</span>
        <span>جامعة أبو بكر إبراهيم</span>
      </div>
    </footer>
  );
}
