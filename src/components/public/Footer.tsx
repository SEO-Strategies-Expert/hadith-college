import Image from "next/image";
import Link from "next/link";

const unavailableSocials = [
  { label: "X", icon: "X" },
  { label: "Instagram", icon: "◎" },
  { label: "YouTube", icon: "▶" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-brand-lockup">
            <Image
              alt="شعار كلية الحديث وعلومه"
              className="footer-logo"
              height={76}
              src="/brand/hadith-college-logo-128.png"
              width={76}
            />
            <div className="footer-brand-name">
              <b>كلية الحديث وعلومه</b>
              <span>للرواية والدراية والتحقيق</span>
            </div>
          </div>
          <p>
            بيئة علمية رقمية تجمع تعليم الحديث المتدرج، والتخريج التطبيقي،
            والتحقيق العلمي للمخطوطات في تجربة عربية أصيلة ومعاصرة.
          </p>
          <div className="socials">
            {unavailableSocials.map((social) => (
              <span
                aria-disabled="true"
                aria-label={social.label}
                key={social.label}
                role="link"
                title="سيتم إضافة الرابط من إدارة الكلية"
              >
                {social.icon}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4>الكلية</h4>
          <ul>
            <li><Link href="/about/mission-vision">الرؤية والرسالة</Link></li>
            <li><Link href="/scientific-body/scientific-council">المجلس العلمي</Link></li>
            <li><Link href="/news">الأخبار والفعاليات</Link></li>
            <li><Link href="/contact">تواصل معنا</Link></li>
          </ul>
        </div>
        <div>
          <h4>الدراسة</h4>
          <ul>
            <li><Link href="/programs">البرامج الأكاديمية</Link></li>
            <li><Link href="/courses">الدورات القصيرة</Link></li>
            <li><Link href="/diplomas">الدبلومات</Link></li>
            <li><Link href="/curricula">مناهج الدراسة</Link></li>
          </ul>
        </div>
        <div>
          <h4>المعرفة الرقمية</h4>
          <ul>
            <li><Link href="/research/takhrij-lab">مختبر التخريج</Link></li>
            <li><Link href="/research/hadith-sites">المواقع الحديثية البحثية</Link></li>
            <li><Link href="/journal/research">مجلة الكلية</Link></li>
            <li><Link href="/research/peer-reviewed">الأبحاث المحكمة</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 كلية الحديث وعلومه. جميع الحقوق محفوظة.</span>
        <span>
          منصة تدريسية بحثية لخدمة علوم الحديث والرواية والدراية والتحقيق.
        </span>
      </div>
    </footer>
  );
}
