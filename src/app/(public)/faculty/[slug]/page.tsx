import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { getPublishedFaculty } from "@/lib/academic/academic-core";

export const dynamic = "force-dynamic";

export default async function FacultyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getPublishedFaculty(slug);
  if (!profile) notFound();
  return (
    <PublicLayout>
      <PageHero title={profile.full_name_ar} lead={profile.bio_short ?? profile.specialization ?? ""} />
      <section className="section"><div className="container grid-2">
        <article className="prose">
          <h2>{profile.academic_title ?? "عضو هيئة تدريس"}</h2>
          <p>{profile.bio_full ?? profile.bio_short}</p>
          <ul>
            <li>التخصص: {profile.specialization ?? "غير محدد"}</li>
            <li>الدرجة: {profile.degree ?? "غير محدد"}</li>
            <li>الجامعة: {profile.university ?? "غير محدد"}</li>
            <li>الإجازات: {profile.ijazat_summary ?? "غير محدد"}</li>
          </ul>
        </article>
        <article className="card"><h2>التواصل والسيرة</h2><p>{profile.public_email ?? "لا يوجد بريد عام"}</p><p>{profile.office_hours ?? "تحدد الساعات لاحقًا"}</p>{profile.cv_file ? <p>CV: {profile.cv_file}</p> : null}</article>
      </div></section>
    </PublicLayout>
  );
}
