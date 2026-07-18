import { describe, expect, it } from "vitest";
import { heroContentSchema } from "@/lib/validations/content";

describe("hero content validation", () => {
  it("accepts safe internal CTA links", () => {
    const parsed = heroContentSchema.safeParse({
      eyebrow_ar: "جامعة أبو بكر إبراهيم",
      title_ar: "كلية الحديث وعلومه",
      lead_ar: "منصة عربية متخصصة في علوم الحديث والرواية والدراية والتحقيق.",
      primary_cta_ar: "قدّم الآن",
      primary_href: "/admissions",
      secondary_cta_ar: "استعرض البرامج",
      secondary_href: "/programs"
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects external CTA redirects", () => {
    const parsed = heroContentSchema.safeParse({
      eyebrow_ar: "جامعة أبو بكر إبراهيم",
      title_ar: "كلية الحديث وعلومه",
      lead_ar: "منصة عربية متخصصة في علوم الحديث والرواية والدراية والتحقيق.",
      primary_cta_ar: "قدّم الآن",
      primary_href: "https://example.com",
      secondary_cta_ar: "استعرض البرامج",
      secondary_href: "/programs"
    });

    expect(parsed.success).toBe(false);
  });
});
