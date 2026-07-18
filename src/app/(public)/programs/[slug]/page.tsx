import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { programs } from "@/lib/demo-data";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();

  return (
    <PublicLayout>
      <PageHero title={program.title} lead={program.excerpt} />
      <section className="section">
        <div className="container grid-2">
          <article className="prose">
            <span className="section-kicker">محتوى البرنامج</span>
            <h2>تعلم متدرج وتطبيق مصحح</h2>
            <p>هذا المحتوى منقول كبداية Demo من الموقع الثابت. في المرحلة التالية سيصبح قابلًا للتحرير من لوحة الإدارة عبر `academic_programs` و`courses`.</p>
            <ul><li>الأهداف ومخرجات التعلم.</li><li>المقررات والوحدات.</li><li>شروط القبول والمدة.</li><li>حالة التسجيل والنشر.</li></ul>
          </article>
          <article className="card"><span className="tag demo">Demo Seed</span><h2 style={{ fontSize: 30 }}>جاهز للربط الإداري</h2><p className="muted">سيظهر أي تعديل منشور من لوحة الإدارة في هذه الصفحة بعد ربط CMS وrevalidation.</p></article>
        </div>
      </section>
    </PublicLayout>
  );
}
