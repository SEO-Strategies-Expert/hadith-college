import { PageHero } from "@/components/public/PageHero";
import { ProgramGrid } from "@/components/public/ProgramGrid";
import { PublicLayout } from "@/components/public/PublicLayout";
import { listPublishedPrograms } from "@/lib/academic/academic-core";

export default async function ProgramsPage() {
  const programs = await listPublishedPrograms();

  return (
    <PublicLayout>
      <PageHero title="البرامج الأكاديمية" lead="برامج كلية الحديث وعلومه المنشورة من قاعدة البيانات، مع ربط المستويات والمقررات من لوحة الإدارة." />
      <section className="section"><div className="container"><ProgramGrid programs={programs} /></div></section>
    </PublicLayout>
  );
}
