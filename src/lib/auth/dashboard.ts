import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Role } from "@/lib/permissions/roles";
import { canAccessDashboard } from "@/lib/permissions/roles";

export type DashboardArea = "admin" | "faculty" | "student";

export async function requireDashboardUser(area: DashboardArea) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name_ar, full_name_en, status, user_roles(roles(slug))")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.status !== "active") {
    redirect("/login?error=account-inactive");
  }

  const roles = ((profile.user_roles ?? []) as unknown as Array<{ roles: { slug: Role } | null }>)
    .map((item) => item.roles?.slug)
    .filter(Boolean) as Role[];

  if (roles.length > 0 && !roles.some((role) => canAccessDashboard(role, area))) {
    redirect("/login?error=unauthorized");
  }

  return { user, profile, roles };
}
