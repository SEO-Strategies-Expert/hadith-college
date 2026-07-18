# Supabase Setup

Local Supabase CLI configuration was initialized with:

```bash
npx supabase init
```

Project listing now works after user login.

Existing projects checked with `npx supabase projects list`:

- `hassan67844@gmail.com's Project` — ref `kgjfkxmbstmwdihlugdp` — region `ap-southeast-1` — status `INACTIVE`
- `Wisaltech-agency-mvp` — ref `uuohrexyjhltucjutmrm` — region `ap-southeast-2` — status `INACTIVE`

No project named `hadith-college-prod` exists yet.

Available organization:

- `Mohamed's Org` — org id `klmwmtefchyceyqvecgq`

CLI-supported regions:

- `ap-east-1`
- `ap-northeast-1`
- `ap-northeast-2`
- `ap-south-1`
- `ap-southeast-1`
- `ap-southeast-2`
- `ca-central-1`
- `eu-central-1`
- `eu-central-2`
- `eu-north-1`
- `eu-west-1`
- `eu-west-2`
- `eu-west-3`
- `sa-east-1`
- `us-east-1`
- `us-east-2`
- `us-west-1`
- `us-west-2`

Recommended free-safe project create shape, after explicit approval and local password entry:

```bash
npx supabase projects create hadith-college-prod \
  --org-id klmwmtefchyceyqvecgq \
  --region eu-central-1 \
  --size nano \
  --db-password "<ENTER_LOCALLY_NOT_IN_CHAT>"
```

Do not use `micro` or larger compute sizes unless the user explicitly approves paid resources.

## HUMAN ACTION REQUIRED — DATABASE PASSWORD

To create `hadith-college-prod`, the database password must be entered locally/securely. Do not paste it into chat.

Once the project exists, run:

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push --dry-run
npx supabase db push
npx supabase gen types typescript --linked > src/types/database.types.ts
```

Current blocked commands before linking:

- `npx supabase db push --dry-run` -> `Cannot find project ref. Have you run supabase link?`
- `npx supabase gen types typescript --local` -> local Supabase database container is not running.
