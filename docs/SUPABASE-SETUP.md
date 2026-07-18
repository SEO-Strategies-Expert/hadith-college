# Supabase Setup

Local Supabase CLI configuration was initialized with:

```bash
npx supabase init
```

Project listing now works after user login.

Projects checked with `npx supabase projects list` include:

- `hassan67844@gmail.com's Project` — ref `kgjfkxmbstmwdihlugdp` — region `ap-southeast-1` — status `INACTIVE`
- `Wisaltech-agency-mvp` — ref `uuohrexyjhltucjutmrm` — region `ap-southeast-2` — status `INACTIVE`
- `hadith-college-prod` — ref `iqowychratwvykhlkfhu` — region `eu-central-1` — status `ACTIVE_HEALTHY`

Project `hadith-college-prod` exists and is linked.

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

Linked project:

```text
name: hadith-college-prod
ref: iqowychratwvykhlkfhu
region: eu-central-1
status: ACTIVE_HEALTHY
```

The previous failing ref `iqowychratwyykhlkfhu` was a typo. The correct ref contains `vy`: `iqowychratwvykhlkfhu`.

## Applied

- `npx supabase@latest link --project-ref iqowychratwvykhlkfhu`
- `npx supabase@latest db lint --linked --level warning --fail-on error`
- `npx supabase@latest db push --dry-run`
- `npx supabase@latest db push`
- `npx supabase@latest db push --include-seed`
- `npx supabase@latest gen types typescript --linked > src/types/database.types.ts`

The database password was entered locally through a secure PowerShell prompt and was removed from the session afterward.
