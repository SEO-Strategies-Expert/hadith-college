"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

async function audit(action: string, entityId: string, newValues: Record<string, unknown>) {
  const admin = createAdminClient();
  await admin.from("audit_logs").insert({
    action,
    entity_type: "profile",
    entity_id: entityId,
    new_values: newValues
  });
}

export async function inviteUser(formData: FormData) {
  const email = value(formData, "email")?.toLowerCase();
  const fullNameAr = value(formData, "full_name_ar");
  const roleId = value(formData, "role_id");

  if (!email || !roleId) {
    redirect("/dashboard/admin/users?error=missing-invite-fields");
  }

  const admin = createAdminClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
  const { data: invite, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name_ar: fullNameAr },
    redirectTo: `${origin}/auth/callback`
  });

  if (error || !invite.user) {
    redirect(`/dashboard/admin/users?error=${encodeURIComponent(error?.message ?? "invite-failed")}`);
  }

  await admin.from("profiles").upsert({
    id: invite.user.id,
    email,
    full_name_ar: fullNameAr,
    status: "invited"
  });

  await admin.from("user_roles").upsert({
    user_id: invite.user.id,
    role_id: roleId
  });

  await audit("user.invite", invite.user.id, { email, role_id: roleId });
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users?saved=invited");
}

export async function assignUserRole(formData: FormData) {
  const userId = value(formData, "user_id");
  const roleId = value(formData, "role_id");
  if (!userId || !roleId) redirect("/dashboard/admin/users?error=missing-role-fields");

  const admin = createAdminClient();
  await admin.from("user_roles").upsert({ user_id: userId, role_id: roleId });
  await audit("user_role.assign", userId, { role_id: roleId });
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users?saved=role-assigned");
}

export async function removeUserRole(formData: FormData) {
  const userId = value(formData, "user_id");
  const roleId = value(formData, "role_id");
  if (!userId || !roleId) redirect("/dashboard/admin/users?error=missing-role-fields");

  const admin = createAdminClient();
  await admin.from("user_roles").delete().eq("user_id", userId).eq("role_id", roleId);
  await audit("user_role.remove", userId, { role_id: roleId });
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users?saved=role-removed");
}

export async function updateUserStatus(formData: FormData) {
  const userId = value(formData, "user_id");
  const status = value(formData, "status");
  if (!userId || !status) redirect("/dashboard/admin/users?error=missing-status-fields");

  const admin = createAdminClient();
  await admin.from("profiles").update({ status }).eq("id", userId);
  await audit("profile.status.update", userId, { status });
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users?saved=status-updated");
}
