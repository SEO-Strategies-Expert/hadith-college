import { LegacyStaticSections } from "@/components/public/LegacyStaticSections";
import { PublicLayout } from "@/components/public/PublicLayout";

// The supplied archive is the approved visual source for the public home page.
// Navigation and application routing remain provided by the current Next shell.
export default function HomePage() {
  return (
    <PublicLayout>
      <LegacyStaticSections route="index" />
    </PublicLayout>
  );
}
