# Implementation Status

Date: 2026-07-18
Branch: `feat/full-college-platform`

## Status Legend

- Done: implemented and checked.
- In Progress: being implemented in the current phase.
- Blocked: requires human authentication, secrets, paid-resource approval, or external provider setup.
- Pending: planned but not yet started.

## Phase Status

| Phase | Area | Status | Notes |
| --- | --- | --- | --- |
| 0 | Audit current static site | Done | See `docs/CURRENT-SITE-AUDIT.md`. |
| 0 | Backup tag | Done | `static-v1-backup` pushed to origin. |
| 0 | Work branch | Done | `feat/full-college-platform` pushed to origin. |
| 1 | Next.js App Router migration | Done | App Router scaffold, route shells, redirects, tests, and asset migration added. |
| 2 | Supabase project setup | Blocked | Login works and projects were listed. `hadith-college-prod` does not exist. Creation requires local Database Password and explicit free-plan approval. |
| 3 | Environment variables | Done | `.env.example` and Zod validation added. Secret values are not committed. |
| 4-6 | Database, roles, permissions, RLS | In Progress | Initial accounts/roles/CMS migration and seed added. `db push --dry-run` blocked until `supabase link`. |
| 7-24 | CMS, academic, dashboard, labs, library, certificates | In Progress | First CMS hero edit cycle implemented in code; real verification blocked until Supabase project exists and migrations are applied. |
| 25 | Security audit | Pending | Requires auth/database implementation first. |
| 26 | Tests | Pending | Unit/E2E scaffolding begins in Phase 1; full coverage later. |
| 27 | Performance/accessibility | Pending | Must be checked throughout migration. |
| 28 | Documentation | In Progress | Audit/status started; full docs pending. |
| 29 | Preview deployment/PR | Pending | Do not merge to `main` until build, auth, CRUD, RLS, and human actions are resolved. |

## Human Actions Required Later

### HUMAN ACTION REQUIRED — DATABASE PASSWORD

Supabase login is complete. The project `hadith-college-prod` does not exist. Creating it requires a Database Password entered locally/securely and explicit confirmation to create a free-plan `nano` project.

Current intended command shape:

```text
npx supabase projects create hadith-college-prod --org-id klmwmtefchyceyqvecgq --region eu-central-1 --size nano --db-password "<ENTER_LOCALLY_NOT_IN_CHAT>"
```

### HUMAN ACTION REQUIRED — VERCEL LOGIN

Before linking deployment settings, authenticate locally with `vercel login` and ensure `vercel link` targets the existing `hadith-college` project only.

### HUMAN ACTION REQUIRED — PROVIDER SECRETS

Email, Zoom, Cron, and Supabase service-role secrets must be configured through environment variables in local/Vercel/Supabase tooling, never committed to Git.

## Not Complete Yet

This repository is not yet a production platform. The following are not complete:

- Real login.
- Supabase database.
- RLS policies.
- Real dashboard CRUD.
- Admissions workflow.
- Assignment submission/grading.
- Attendance.
- Certificates and verification.
- Private file storage.
- Email and Zoom integrations.
- Production Vercel environment configuration.

## Latest Validation

Completed on 2026-07-18:

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run test` passed: 1 file, 2 unit tests.
- `npm run test:e2e` passed: 2 Playwright smoke tests.
- `npm run build` passed: 26 static/SSG routes.
- `npm audit --audit-level=moderate` passed: 0 vulnerabilities after `postcss` override.
- `npx supabase projects list` passed; `hadith-college-prod` was not found.
- `npx supabase db push --dry-run` blocked because no Supabase project is linked.
- `npx supabase gen types typescript --local` blocked because no local Supabase database container is running.

## Commits

- `d1fec08` - `chore: backup legacy static site`
- `b452756` - `feat: initialize nextjs platform`
- Supabase accounts/CMS commit pending at the time of this status update.
