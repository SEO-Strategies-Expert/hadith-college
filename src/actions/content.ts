"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { heroContentSchema } from "@/lib/validations/content";

export async function updateHomeHero(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/dashboard/admin/content/home?error=supabase-not-configured");
  }

  const parsed = heroContentSchema.safeParse({
    eyebrow_ar: formData.get("eyebrow_ar"),
    title_ar: formData.get("title_ar"),
    lead_ar: formData.get("lead_ar"),
    primary_cta_ar: formData.get("primary_cta_ar"),
    primary_href: formData.get("primary_href"),
    secondary_cta_ar: formData.get("secondary_cta_ar"),
    secondary_href: formData.get("secondary_href")
  });

  if (!parsed.success) {
    redirect("/dashboard/admin/content/home?error=invalid-content");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id")
    .eq("slug", "home")
    .maybeSingle();

  if (pageError || !page) {
    redirect("/dashboard/admin/content/home?error=home-page-missing");
  }

  const { data: section, error: sectionError } = await supabase
    .from("page_sections")
    .select("id, content_json")
    .eq("page_id", page.id)
    .eq("section_type", "hero")
    .maybeSingle();

  if (sectionError || !section) {
    redirect("/dashboard/admin/content/home?error=hero-section-missing");
  }

  await supabase.from("content_revisions").insert({
    entity_type: "page_section",
    entity_id: section.id,
    revision_number: Math.floor(Date.now() / 1000),
    snapshot_json: section.content_json,
    created_by: user.id
  });

  const { error } = await supabase
    .from("page_sections")
    .update({
      content_json: parsed.data,
      status: "published",
      updated_by: user.id
    })
    .eq("id", section.id);

  if (error) {
    redirect(`/dashboard/admin/content/home?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/dashboard/admin/content/home");
  redirect("/dashboard/admin/content/home?saved=1");
}
