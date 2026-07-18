import { z } from "zod";

export const heroContentSchema = z.object({
  eyebrow_ar: z.string().trim().min(2).max(120),
  title_ar: z.string().trim().min(2).max(160),
  lead_ar: z.string().trim().min(10).max(500),
  primary_cta_ar: z.string().trim().min(2).max(80),
  primary_href: z.string().trim().startsWith("/").max(120),
  secondary_cta_ar: z.string().trim().min(2).max(80),
  secondary_href: z.string().trim().startsWith("/").max(120)
});

export type HeroContent = z.infer<typeof heroContentSchema>;
