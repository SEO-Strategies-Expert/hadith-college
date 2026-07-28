import Link from "next/link";
import { LegacyStaticSections } from "@/components/public/LegacyStaticSections";
import { PublicLayout } from "@/components/public/PublicLayout";
import { listPublishedFaculty } from "@/lib/academic/academic-core";

export default async function FacultyPublicPage() {
  const faculty = await listPublishedFaculty();
  return (
    <PublicLayout>
      <LegacyStaticSections route="faculty" />
      {faculty.length ? <section className="section"><div className="container record-grid">
        {faculty.map((item: { id: string; full_name_ar: string; slug: string; academic_title: string | null; specialization: string | null; bio_short: string | null }) => (
          <article className="card" key={item.id}>
            <span className="tag demo">{item.academic_title ?? "عضو هيئة تدريس"}</span>
            <h3>{item.full_name_ar}</h3>
            <p>{item.specialization}</p>
            <p className="muted">{item.bio_short}</p>
            <Link className="text-link" href={`/faculty/${item.slug}`}>عرض الملف</Link>
          </article>
        ))}
      </div></section> : null}
    </PublicLayout>
  );
}
