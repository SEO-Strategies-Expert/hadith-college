# Architecture

## Current Phase

The repository is now a Next.js App Router application. The legacy static site is preserved in `legacy-static/` and should be treated as reference material during migration.

## Main Directories

- `src/app`: App Router routes.
- `src/components/public`: Public website components.
- `src/components/dashboard`: Dashboard layout and route-shell components.
- `src/lib`: shared data, validation, Supabase clients, and permission helpers.
- `src/styles`: migrated site CSS.
- `public/assets`: public images, CSS, and JavaScript assets from the static site.
- `legacy-static`: original static HTML snapshot.
- `supabase`: local Supabase CLI configuration.
- `tests`: Vitest and Playwright tests.

## Current Data Model

No production database is connected yet. `src/lib/demo-data.ts` contains clearly temporary demo data used only to keep routes renderable while database migrations are designed.

## Next Milestone

Phase 2 should authenticate Supabase CLI, link or create the `hadith-college-prod` project, and start PostgreSQL migrations for profiles, roles, permissions, CMS, and academic programs.
