import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "../src/types/database.types";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} environment variable.`);
  }
  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const publishableKey = requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

const service = createClient<Database, "public">(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const testEmail = `cms-rls-${Date.now()}@example.invalid`;
const testPassword = crypto.randomUUID() + crypto.randomUUID();
let testUserId: string | undefined;
let previousHero: Json | undefined;
let heroSectionId: string | undefined;

function throwSupabaseError(context: string, error: unknown): never {
  const normalized = error && typeof error === "object" ? JSON.stringify(error) : String(error);
  throw new Error(`${context}: ${normalized}`);
}

async function main() {
  console.log("VERIFY_STAGE=create-test-user");
  const { data: userData, error: createError } = await service.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name_ar: "مستخدم اختبار CMS" }
  });
  if (createError || !userData.user) throwSupabaseError("create-test-user", createError ?? "missing user");
  testUserId = userData.user.id;

  console.log("VERIFY_STAGE=load-content-editor-role");
  const { data: role, error: roleError } = await service
    .from("roles")
    .select("id")
    .eq("slug", "content_editor")
    .single();
  if (roleError || !role) throwSupabaseError("load-content-editor-role", roleError ?? "missing role");

  console.log("VERIFY_STAGE=upsert-profile");
  const { error: profileError } = await service
    .from("profiles")
    .upsert({ id: testUserId, email: testEmail, status: "active" });
  if (profileError) throwSupabaseError("upsert-profile", profileError);

  console.log("VERIFY_STAGE=assign-role");
  const { error: roleAssignError } = await service
    .from("user_roles")
    .upsert({ user_id: testUserId, role_id: role.id });
  if (roleAssignError) throwSupabaseError("assign-role", roleAssignError);

  const authed = createClient<Database, "public">(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("VERIFY_STAGE=sign-in-test-user");
  const { error: signInError } = await authed.auth.signInWithPassword({
    email: testEmail,
    password: testPassword
  });
  if (signInError) throwSupabaseError("sign-in-test-user", signInError);

  console.log("VERIFY_STAGE=read-home-page");
  const { data: homePage, error: pageError } = await authed
    .from("pages")
    .select("id")
    .eq("slug", "home")
    .single();
  if (pageError || !homePage) throwSupabaseError("read-home-page", pageError ?? "missing page");

  console.log("VERIFY_STAGE=read-hero-section");
  const { data: section, error: sectionError } = await authed
    .from("page_sections")
    .select("id, content_json")
    .eq("page_id", homePage.id)
    .eq("section_type", "hero")
    .single();
  if (sectionError || !section) throwSupabaseError("read-hero-section", sectionError ?? "missing section");

  heroSectionId = section.id;
  previousHero = section.content_json;

  const updatedHero = {
    eyebrow_ar: "جامعة أبو بكر إبراهيم",
    title_ar: "كلية الحديث وعلومه",
    lead_ar: `تحقق CMS منشور من Supabase ${Date.now()}`,
    primary_cta_ar: "قدّم الآن",
    primary_href: "/admissions",
    secondary_cta_ar: "استعرض البرامج",
    secondary_href: "/programs"
  };

  console.log("VERIFY_STAGE=insert-content-revision");
  const { error: revisionError } = await authed.from("content_revisions").insert({
    entity_type: "page_section",
    entity_id: heroSectionId,
    revision_number: Math.floor(Date.now() / 1000),
    snapshot_json: previousHero
  });
  if (revisionError) throwSupabaseError("insert-content-revision", revisionError);

  console.log("VERIFY_STAGE=publish-hero-update");
  const { error: updateError } = await authed
    .from("page_sections")
    .update({ content_json: updatedHero, status: "published", is_visible: true })
    .eq("id", heroSectionId);
  if (updateError) throwSupabaseError("publish-hero-update", updateError);

  const anon = createClient<Database, "public">(supabaseUrl, publishableKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log("VERIFY_STAGE=anonymous-read-published-hero");
  const { data: publicRead, error: publicError } = await anon
    .from("pages")
    .select("id, page_sections(id, content_json)")
    .eq("slug", "home")
    .eq("status", "published")
    .eq("page_sections.section_type", "hero")
    .eq("page_sections.status", "published")
    .single();
  if (publicError || !publicRead) throwSupabaseError("anonymous-read-published-hero", publicError ?? "missing public read");

  const publicHero = Array.isArray(publicRead.page_sections) ? publicRead.page_sections[0]?.content_json : undefined;
  if (
    !publicHero ||
    typeof publicHero !== "object" ||
    !("lead_ar" in publicHero) ||
    publicHero.lead_ar !== updatedHero.lead_ar
  ) {
    throw new Error("published hero was not visible to anonymous readers.");
  }

  console.log("VERIFY_STAGE=anonymous-draft-check");
  const { data: draftRead, error: draftError } = await anon
    .from("pages")
    .select("id")
    .eq("status", "draft")
    .limit(1);
  if (draftError) throwSupabaseError("anonymous-draft-check", draftError);
  if ((draftRead ?? []).length > 0) {
    throw new Error("anonymous user can read draft pages.");
  }

  console.log("SUPABASE_CMS_RLS_VERIFICATION=passed");
}

async function cleanup() {
  if (heroSectionId && previousHero) {
    await service.from("page_sections").update({ content_json: previousHero }).eq("id", heroSectionId);
  }
  if (testUserId) {
    await service.from("user_roles").delete().eq("user_id", testUserId);
    await service.auth.admin.deleteUser(testUserId);
  }
}

main()
  .finally(cleanup)
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
