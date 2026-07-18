import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.BOOTSTRAP_ADMIN_EMAIL;

if (!supabaseUrl || !serviceRoleKey || !email) {
  console.log("HUMAN ACTION REQUIRED — configure NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and BOOTSTRAP_ADMIN_EMAIL in a secure environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

if (error) {
  console.error(`Failed to invite bootstrap admin: ${error.message}`);
  process.exit(1);
}

const userId = data.user?.id;

if (!userId) {
  console.error("Invite completed without a user id.");
  process.exit(1);
}

const { data: role, error: roleError } = await supabase
  .from("roles")
  .select("id")
  .eq("slug", "super_admin")
  .single();

if (roleError || !role) {
  console.error("The super_admin role was not found. Apply migrations and seed data first.");
  process.exit(1);
}

const { error: profileError } = await supabase.from("profiles").upsert({
  id: userId,
  email,
  status: "invited"
});

if (profileError) {
  console.error(`Failed to upsert bootstrap profile: ${profileError.message}`);
  process.exit(1);
}

const { error: assignError } = await supabase.from("user_roles").upsert({
  user_id: userId,
  role_id: role.id
});

if (assignError) {
  console.error(`Failed to assign super_admin role: ${assignError.message}`);
  process.exit(1);
}

console.log(`Bootstrap admin invite sent and super_admin role assigned for ${email}.`);
