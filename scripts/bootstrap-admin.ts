const email = process.env.BOOTSTRAP_ADMIN_EMAIL;

if (!email) {
  console.log("HUMAN ACTION REQUIRED — BOOTSTRAP_ADMIN_EMAIL is not configured.");
  process.exit(1);
}

console.log(`Bootstrap admin invite is not active until Supabase auth is linked. Requested email: ${email}`);
