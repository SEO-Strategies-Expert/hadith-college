import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { publicPages } from "@/lib/demo-data";

export function generateStaticParams() {
  return publicPages.map((page) => ({ slug: page.slug }));
}

export default async function PublicContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = publicPages.find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <PublicLayout>
      <PageHero title={page.title} lead={page.lead} />
      <section className="section">
        <div className="container grid-2">
          <article className="prose">
            <span className="section-kicker">مرحلة التحويل</span>
            <h2>المحتوى محفوظ وجاهز للتحويل إلى CMS</h2>
            <p>هذه الصفحة أصبحت Route داخل Next.js App Router. سيتم في المراحل التالية نقل نصوصها وأقسامها إلى جداول `pages` و`page_sections` مع سجل مراجعات ونشر.</p>
          </article>
          <article className="platform-note">
            <b>مصدر البيانات الحالي:</b> Demo مؤقت داخل التطبيق. لا توجد قاعدة بيانات أو تسجيل دخول حقيقي بعد.
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}
