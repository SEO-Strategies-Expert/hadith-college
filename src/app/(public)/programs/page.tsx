import { LegacyStaticSections } from "@/components/public/LegacyStaticSections";
import { ProgramGrid } from "@/components/public/ProgramGrid";
import { PublicLayout } from "@/components/public/PublicLayout";
import { listPublishedPrograms } from "@/lib/academic/academic-core";

export default async function ProgramsPage() {
  const programs = await listPublishedPrograms();

  return (
    <PublicLayout>
      <LegacyStaticSections route="programs" />
      {programs.length ? <section className="section"><div className="container"><ProgramGrid programs={programs} /></div></section> : null}
    </PublicLayout>
  );
}
