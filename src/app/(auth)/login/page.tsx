import { signInWithEmail } from "@/actions/auth";
import { PublicLayout } from "@/components/public/PublicLayout";
import Image from "next/image";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const sent = params.sent === "1";
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <PublicLayout>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-shell">
            <span className="section-kicker">تسجيل الدخول</span>
            <h1>الدخول إلى المنصة</h1>
            <p className="lead">تسجيل دخول آمن عبر رابط بريد إلكتروني. لا توجد كلمات مرور افتراضية داخل المشروع.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          <article className="card">
            <div className="auth-brand">
              <Image alt="شعار كلية الحديث وعلومه" src="/brand/hadith-college-logo-128.png" width={80} height={80} />
              <div><b>كلية الحديث وعلومه</b><span>الدخول الآمن إلى البوابة الأكاديمية</span></div>
            </div>
            <form action={signInWithEmail}>
              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input className="form-control" id="email" name="email" required type="email" />
                </div>
                <div className="field full">
                  <button className="btn gold" type="submit">إرسال رابط الدخول</button>
                </div>
              </div>
            </form>
          </article>
          <article className="platform-note">
            {sent ? <p>تم طلب رابط الدخول. افحص البريد المرتبط بحسابك.</p> : null}
            {error ? <p>تعذر تنفيذ الطلب: {error}</p> : null}
            <p>يتطلب تسجيل الدخول ضبط Supabase URL وPublishable Key في البيئة.</p>
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}
