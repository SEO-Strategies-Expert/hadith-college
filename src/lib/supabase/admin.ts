import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type LooseDatabase = {
  public: {
    Tables: {
      [table: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export function createAdminClient(): SupabaseClient<LooseDatabase> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase service role environment variables are not configured.");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}
