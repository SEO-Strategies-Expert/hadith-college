import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { listPublishedFaculty } from "@/lib/academic/academic-core";

export default async function FacultyPublicPage() {
  const faculty = await listPublishedFaculty();
  return (
    <PublicLayout>
      <PageHero title="الهيئة العلمية" lead="أعضاء هيئة التدريس المنشورون من لوحة الإدارة." />
      <section className="section"><div className="container record-grid">
        {faculty.map((item: { id: string; full_name_ar: string; slug: string; academic_title: string | null; specialization: string | null; bio_short: string | null }) => (
          <article className="card" key={item.id}>
            <span className="tag demo">{item.academic_title ?? "عضو هيئة تدريس"}</span>
            <h3>{item.full_name_ar}</h3>
            <p>{item.specialization}</p>
            <p className="muted">{item.bio_short}</p>
            <Link className="text-link" href={`/faculty/${item.slug}`}>عرض الملف</Link>
          </article>
        ))}
        {faculty.length === 0 ? <p className="notice">لا توجد ملفات منشورة حاليًا.</p> : null}
      </div></section>
    </PublicLayout>
  );
}
