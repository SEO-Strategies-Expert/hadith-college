"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function signInWithEmail(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=supabase-not-configured");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?sent=1");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
