# Supabase Setup

Local Supabase CLI configuration was initialized with:

```bash
npx supabase init
```

Project listing currently requires authentication:

```text
Access token not provided. Supply an access token by running `supabase login` or setting the SUPABASE_ACCESS_TOKEN environment variable.
```

## HUMAN ACTION REQUIRED — SUPABASE LOGIN

Run one of the following locally:

```bash
npx supabase login
```

or provide `SUPABASE_ACCESS_TOKEN` through a secure terminal/environment mechanism.

Do not paste the access token, database password, or service role key into chat.

After authentication, the next step is to look for an existing project named `hadith-college-prod` before creating anything new.
