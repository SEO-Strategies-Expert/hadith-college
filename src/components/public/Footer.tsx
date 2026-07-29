import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  {
    title: "الكلية",
    links: [["/about", "الرؤية والرسالة"], ["/faculty", "المجلس العلمي"], ["/news", "الأخبار والفعاليات"], ["/contact", "تواصل معنا"]],
  },
  {
    title: "الدراسة",
    links: [["/programs", "البرامج الأكاديمية"], ["/courses", "الدورات القصيرة"], ["/ijazat", "الإجازات العلمية"], ["/admissions", "القبول والتسجيل"]],
  },
  {
    title: "المعرفة الرقمية",
    links: [["/takhrij-lab", "مختبر التخريج"], ["/manuscripts-lab", "مختبر التحقيق"], ["/library", "المكتبة الرقمية"], ["/hadith-research-sites", "المواقع الحديثية البحثية"], ["/publications", "مجلة الكلية"]],
  },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <div className="footer-brand-lockup">
            <Image alt="شعار كلية الحديث وعلومه" className="footer-logo" height={76} src="/assets/img/logo-official.png" width={76} />
            <div className="footer-brand-name"><b>كلية الحديث وعلومه</b><span>للرواية والدراية والتحقيق</span></div>
          </div>
          <p>بيئة علمية رقمية تجمع تعليم الحديث المتدرج، والتخريج التطبيقي، والتحقيق العلمي للمخطوطات في تجربة عربية أصيلة ومعاصرة.</p>
          <div className="socials"><span aria-label="X">X</span><span aria-label="Instagram">◎</span><span aria-label="YouTube">▶</span></div>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h4>{group.title}</h4>
            <ul>{group.links.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom"><span>© 2026 كلية الحديث وعلومه. جميع الحقوق محفوظة.</span><span>منصة تدريسية بحثية لخدمة علوم الحديث والرواية والدراية والتحقيق.</span></div>
    </footer>
  );
}
