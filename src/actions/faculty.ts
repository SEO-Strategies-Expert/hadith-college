"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

function read(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function upsertFacultyProfile(formData: FormData) {
  const id = read(formData, "id");
  const email = read(formData, "email")?.toLowerCase();
  const fullNameAr = read(formData, "full_name_ar");
  const slug = read(formData, "slug");
  if (!fullNameAr || !slug) redirect("/dashboard/admin/faculty?error=missing-fields");

  const admin = createAdminClient();
  let userId = read(formData, "user_id");

  if (!userId && email) {
    const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name_ar: fullNameAr },
      redirectTo: `${origin}/auth/callback`
    });
    if (error || !data.user) {
      redirect(`/dashboard/admin/faculty?error=${encodeURIComponent(error?.message ?? "invite-failed")}`);
    }
    userId = data.user.id;
    await admin.from("profiles").upsert({ id: userId, email, full_name_ar: fullNameAr, status: "invited" });
    const { data: instructorRole } = await admin.from("roles").select("id").eq("slug", "instructor").maybeSingle();
    if (instructorRole) await admin.from("user_roles").upsert({ user_id: userId, role_id: instructorRole.id });
  }

  const payload = {
    user_id: userId,
    full_name_ar: fullNameAr,
    full_name_en: read(formData, "full_name_en"),
    slug,
    academic_title: read(formData, "academic_title"),
    specialization: read(formData, "specialization"),
    degree: read(formData, "degree"),
    university: read(formData, "university"),
    bio_short: read(formData, "bio_short"),
    bio_full: read(formData, "bio_full"),
    experience: read(formData, "experience"),
    ijazat_summary: read(formData, "ijazat_summary"),
    research: read(formData, "research"),
    languages: (read(formData, "languages") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
    public_email: read(formData, "public_email"),
    office_hours: read(formData, "office_hours"),
    profile_image: read(formData, "profile_image"),
    cv_file: read(formData, "cv_file"),
    is_featured: bool(formData, "is_featured"),
    status: read(formData, "status") ?? "draft",
    sort_order: Number(read(formData, "sort_order") ?? 0)
  };

  if (id) {
    await admin.from("faculty_profiles").update(payload).eq("id", id);
  } else {
    await admin.from("faculty_profiles").insert(payload);
  }

  revalidatePath("/dashboard/admin/faculty");
  revalidatePath("/faculty");
  redirect("/dashboard/admin/faculty?saved=1");
}

export async function updateFacultyStatus(formData: FormData) {
  const id = read(formData, "id");
  const status = read(formData, "status") ?? "draft";
  if (!id) redirect("/dashboard/admin/faculty?error=missing-id");
  const admin = createAdminClient();
  await admin.from("faculty_profiles").update({ status }).eq("id", id);
  revalidatePath("/dashboard/admin/faculty");
  redirect("/dashboard/admin/faculty?saved=status");
}
