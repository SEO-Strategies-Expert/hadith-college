import { PageHero } from "@/components/public/PageHero";
import { ProgramGrid } from "@/components/public/ProgramGrid";
import { PublicLayout } from "@/components/public/PublicLayout";

export default function ProgramsPage() {
  return (
    <PublicLayout>
      <PageHero title="البرامج الأكاديمية" lead="برامج كلية الحديث وعلومه الحالية محفوظة كبذور Demo تمهيدًا لنقلها إلى قاعدة البيانات." />
      <section className="section"><div className="container"><ProgramGrid /></div></section>
    </PublicLayout>
  );
}
