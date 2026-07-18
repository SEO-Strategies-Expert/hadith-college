import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-brand-lockup">
            <Image alt="شعار كلية الحديث وعلومه" className="footer-logo" src="/assets/img/logo-official.png" width={72} height={72} />
            <div className="footer-brand-name"><b>كلية الحديث وعلومه</b><span>للرواية والدراية والتحقيق</span></div>
          </div>
          <p>بيئة علمية رقمية تجمع تعليم الحديث المتدرج، والتخريج التطبيقي، والتحقيق العلمي للمخطوطات في تجربة عربية أصيلة ومعاصرة.</p>
        </div>
        <div><h4>الكلية</h4><ul><li><Link href="/about">الرؤية والرسالة</Link></li><li><Link href="/faculty">المجلس العلمي</Link></li><li><Link href="/news">الأخبار والفعاليات</Link></li><li><Link href="/contact">تواصل معنا</Link></li></ul></div>
        <div><h4>الدراسة</h4><ul><li><Link href="/programs">البرامج الأكاديمية</Link></li><li><Link href="/courses">الدورات القصيرة</Link></li><li><Link href="/ijazat">الإجازات العلمية</Link></li><li><Link href="/admissions">القبول والتسجيل</Link></li></ul></div>
        <div><h4>المعرفة الرقمية</h4><ul><li><Link href="/takhrij-lab">مختبر التخريج</Link></li><li><Link href="/manuscripts-lab">مختبر التحقيق</Link></li><li><Link href="/library">المكتبة الرقمية</Link></li><li><Link href="/research-sites">المواقع الحديثية البحثية</Link></li></ul></div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 كلية الحديث وعلومه. جميع الحقوق محفوظة.</span>
        <span>جامعة أبو بكر إبراهيم - موضع الاعتماد الحالي محفوظ في الهوية.</span>
      </div>
    </footer>
  );
}
