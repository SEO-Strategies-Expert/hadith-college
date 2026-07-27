import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProgramSummary } from "@/lib/academic/academic-core";

export async function listPublishedProgramsByType(programType: string): Promise<ProgramSummary[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("academic_programs")
    .select("id, slug, name_ar, short_description, full_description, duration_text, status, is_featured, sort_order")
    .eq("program_type", programType)
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return (data ?? []) as ProgramSummary[];
}
