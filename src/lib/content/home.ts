import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { HeroContent, heroContentSchema } from "@/lib/validations/content";

export const fallbackHero: HeroContent = {
  eyebrow_ar: "جامعة أبو بكر إبراهيم",
  title_ar: "كلية الحديث وعلومه",
  lead_ar: "منصة أكاديمية متخصصة في علوم الحديث، تجمع بين التأصيل العلمي والتدريب التطبيقي والبحث المنهجي.",
  primary_cta_ar: "قدّم الآن",
  primary_href: "/admissions",
  secondary_cta_ar: "استعرض البرامج",
  secondary_href: "/programs"
};

type SectionRow = {
  id: string;
  content_json: unknown;
};

export async function getHomeHero(): Promise<{ content: HeroContent; source: "supabase" | "fallback"; sectionId?: string }> {
  noStore();

  if (!isSupabaseConfigured()) {
    return { content: fallbackHero, source: "fallback" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, page_sections(id, content_json)")
    .eq("slug", "home")
    .eq("status", "published")
    .eq("page_sections.section_type", "hero")
    .eq("page_sections.status", "published")
    .maybeSingle();

  if (error || !data) {
    return { content: fallbackHero, source: "fallback" };
  }

  const sections = (data.page_sections ?? []) as SectionRow[];
  const heroSection = sections[0];
  const parsed = heroContentSchema.safeParse(heroSection?.content_json);

  if (!parsed.success) {
    return { content: fallbackHero, source: "fallback" };
  }

  return { content: parsed.data, source: "supabase", sectionId: heroSection.id };
}
