"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

function read(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export async function upsertStudentProfile(formData: FormData) {
  const id = read(formData, "id");
  const email = read(formData, "email")?.toLowerCase();
  const fullNameAr = read(formData, "full_name_ar");
  const studentNumber = read(formData, "student_number");
  if (!email || !fullNameAr || !studentNumber) redirect("/dashboard/admin/students?error=missing-fields");

  const admin = createAdminClient();
  let userId = read(formData, "user_id");
  if (!userId && formData.get("invite") === "on") {
    const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name_ar: fullNameAr },
      redirectTo: `${origin}/auth/callback`
    });
    if (error || !data.user) redirect(`/dashboard/admin/students?error=${encodeURIComponent(error?.message ?? "invite-failed")}`);
    userId = data.user.id;
    await admin.from("profiles").upsert({ id: userId, email, full_name_ar: fullNameAr, status: "invited" });
    const { data: studentRole } = await admin.from("roles").select("id").eq("slug", "student").maybeSingle();
    if (studentRole) await admin.from("user_roles").upsert({ user_id: userId, role_id: studentRole.id });
  }

  const payload = {
    user_id: userId,
    student_number: studentNumber,
    full_name_ar: fullNameAr,
    full_name_en: read(formData, "full_name_en"),
    email,
    phone: read(formData, "phone"),
    nationality: read(formData, "nationality"),
    country: read(formData, "country"),
    date_of_birth: read(formData, "date_of_birth"),
    qualification: read(formData, "qualification"),
    admission_status: read(formData, "admission_status") ?? "applicant",
    academic_status: read(formData, "academic_status") ?? "applicant",
    fee_status: read(formData, "fee_status") ?? "pending",
    program_id: read(formData, "program_id"),
    current_level_id: read(formData, "current_level_id"),
    joined_at: read(formData, "joined_at"),
    graduated_at: read(formData, "graduated_at"),
    notes: read(formData, "notes")
  };

  if (id) await admin.from("student_profiles").update(payload).eq("id", id);
  else await admin.from("student_profiles").insert(payload);

  await admin.from("audit_logs").insert({
    action: id ? "student.update" : "student.create",
    entity_type: "student_profile",
    entity_id: id,
    new_values: payload
  });

  revalidatePath("/dashboard/admin/students");
  redirect("/dashboard/admin/students?saved=1");
}

export async function updateStudentStatus(formData: FormData) {
  const id = read(formData, "id");
  const academicStatus = read(formData, "academic_status");
  if (!id || !academicStatus) redirect("/dashboard/admin/students?error=missing-status");
  const admin = createAdminClient();
  await admin.from("student_profiles").update({ academic_status: academicStatus }).eq("id", id);
  await admin.from("audit_logs").insert({ action: "student.status.update", entity_type: "student_profile", entity_id: id, new_values: { academic_status: academicStatus } });
  revalidatePath("/dashboard/admin/students");
  redirect("/dashboard/admin/students?saved=status");
}
