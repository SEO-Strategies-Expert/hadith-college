# Current Site Audit

Date: 2026-07-18
Repository: `SEO-Strategies-Expert/hadith-college`
Production branch audited: `main`
Working branch: `feat/full-college-platform`
Backup tag: `static-v1-backup`

## Executive Summary

The current project is a static Arabic RTL HTML preview for "كلية الحديث وعلومه". It contains the public website, three dashboard previews, and a research-sites admin preview. It is suitable for Vercel as a static site, but it is not yet a production platform:

- No real authentication.
- No database.
- No server-side authorization.
- Dashboard data is hardcoded in HTML or JavaScript.
- Some UI actions display demo toasts instead of persisting data.
- Research-sites management uses `localStorage`.
- Admission forms are frontend-only.
- Zoom, email, file uploads, payments, certificates, grading, and attendance are mock concepts only.

## Current Files

### Public HTML Pages

- `index.html`
- `about.html`
- `admissions.html`
- `contact.html`
- `courses.html`
- `faculty.html`
- `hadith-research-sites.html`
- `ijazat.html`
- `library.html`
- `manuscripts-lab.html`
- `news.html`
- `program-foundation.html`
- `program-higher.html`
- `program-manuscripts.html`
- `program-takhrij.html`
- `programs.html`
- `publications.html`
- `student-dashboard.html`
- `takhrij-lab.html`

### Dashboard HTML Pages

- `dashboards/index.html`
- `dashboards/dashboard-admin.html`
- `dashboards/dashboard-faculty.html`
- `dashboards/dashboard-student.html`
- `dashboards/research-sites-admin.html`

### Assets

- `assets/css/style.css`
- `assets/js/main.js`
- `assets/img/logo-official.png`
- `assets/img/favicon.png`

## Current Components To Extract

- Top bar / accreditation bar.
- Site header.
- Brand lockup with official logo.
- Responsive navigation.
- Mega menu.
- Public footer.
- Page hero.
- Homepage hero and statistics.
- Program cards.
- Faculty cards.
- News/publication cards.
- Research-site cards.
- Fees modal.
- Admission form.
- Dashboard layout shell.
- Dashboard sidebar.
- Dashboard header.
- Dashboard metric cards.
- Dashboard tables.
- Dashboard forms and modals.
- Research-sites admin form.
- Toast notifications.

## Current Frontend Behavior

`assets/js/main.js` handles:

- Mobile navigation toggle.
- Reveal animations through `IntersectionObserver`.
- Fees modal open/close behavior.
- Saving selected fee choice to `localStorage`.
- Demo admission/contact form submission message.
- Animated counters.
- Research-sites grid rendering and filtering.
- Research-sites preview rendering.

Dashboard pages contain inline JavaScript for:

- Mobile sidebar toggles.
- Toggle switches saved in `localStorage`.
- Modal open/close behavior.
- Demo toast messages.
- Demo countdown timers.
- Fee-choice toggles saved in `localStorage`.

`dashboards/research-sites-admin.html` additionally contains a local CRUD prototype that stores data in `localStorage` under `hadithResearchSites` and supports JSON import/export.

## Demo Data Found

- Research sites in `assets/js/main.js` and `dashboards/research-sites-admin.html`.
- Public program descriptions and cards hardcoded across HTML pages.
- Dashboard metrics, tables, students, lesson states, fee counts, live-session dates, and attendance/progress examples hardcoded in dashboard HTML.
- Admissions form fields are demo-only and do not submit to a backend.
- Email, Zoom, grading, notifications, certificates, and files are represented by UI text and demo toasts only.

All migrated seed data must be marked with `is_demo = true` unless verified as official production content.

## Link And Asset Check

Automated local reference check result: `NO_MISSING_LOCAL_REFERENCES`.

The audit checked local `href`, `src`, and CSS `url(...)` references in `.html` and `.css` files. External links were excluded from local file validation.

## Dashboard Findings

### Student Dashboard

Current route: `dashboards/dashboard-student.html`

Preview capabilities:

- Course overview.
- Broadcast/calendar section.
- Lab submissions section.
- Tests/reviews section.
- Certificates/ijazat navigation placeholder.
- Notifications/support navigation placeholder.
- Flexible fees UI.

Production migration target:

- `src/app/(dashboard)/student`
- Data from Supabase enrollments, course sections, lessons, live sessions, assignments, grades, attendance, certificates, notifications, and fee choices.

### Admin Dashboard

Current route: `dashboards/dashboard-admin.html`

Preview capabilities:

- Executive metrics.
- Programs and courses navigation placeholder.
- Admissions/students section.
- Faculty section.
- Broadcast/calendar section.
- Grading/evaluation navigation placeholder.
- Library/database navigation placeholder.
- Research-sites link.
- Reports/notifications placeholder.
- Flexible fees counts.

Production migration target:

- `src/app/(dashboard)/admin`
- Role-aware modules backed by Supabase tables, RLS, and server actions.

### Faculty Dashboard

Current route: `dashboards/dashboard-faculty.html`

Preview capabilities:

- Course/session overview.
- Student/progress previews.
- Lessons and assignment actions.
- Broadcast/calendar actions.
- Demo toasts and modals.

Production migration target:

- `src/app/(dashboard)/faculty`
- Course-instructor-scoped data only.

### Research Sites Admin

Current route: `dashboards/research-sites-admin.html`

Preview capabilities:

- Add/edit/delete/reorder research sites.
- Active/featured toggles.
- Search.
- JSON import/export.
- Local persistence using `localStorage`.

Production migration target:

- `src/app/(dashboard)/admin/research-sites`
- Supabase-backed CRUD with soft delete, validation, ordering, featured flag, categories, and URL health checks.

## Risks

- Full conversion is large and must be phased; attempting to replace everything in one commit would increase regression risk.
- Static pages contain repeated HTML; migration should first extract layout and shared components before database wiring.
- Current dashboards are visual prototypes, not secure application surfaces.
- `localStorage` must be removed as a production data source.
- Supabase and Vercel operations require authenticated CLI sessions and environment variables that must not be sent through chat.
- External integrations for Zoom, email, storage policies, and scheduled jobs cannot be claimed complete until credentials and provider configuration exist.
- Religious/academic content must remain demo-labeled unless sourced and approved.

## Migration Plan To Next.js

| Current Page | New Route | Notes |
| --- | --- | --- |
| `index.html` | `/` | Convert to public homepage using shared header, hero, stats, program grid, research preview, fees modal, footer. |
| `about.html` | `/about` | Public page; later backed by CMS `pages` and `page_sections`. |
| `programs.html` | `/programs` | Program index; later backed by `academic_programs`. |
| `program-foundation.html` | `/programs/foundation` | Seed from current content. |
| `program-takhrij.html` | `/programs/takhrij` | Seed from current content. |
| `program-manuscripts.html` | `/programs/manuscripts` | Seed from current content. |
| `program-higher.html` | `/programs/higher` | Seed from current content. |
| `courses.html` | `/courses` | Later backed by `courses`. |
| `ijazat.html` | `/ijazat` | Later backed by certificates/ijazat tables. |
| `admissions.html` | `/admissions` | Replace demo form with validated server action after Supabase setup. |
| `faculty.html` | `/faculty` | Later backed by public faculty profiles. |
| `library.html` | `/library` | Later backed by library tables and storage access rules. |
| `publications.html` | `/publications` | Later backed by publications/journal/news tables. |
| `news.html` | `/news` | Later backed by `news_posts`. |
| `contact.html` | `/contact` | Later backed by contact messages. |
| `takhrij-lab.html` | `/takhrij-lab` | Later backed by takhrij task tables. |
| `manuscripts-lab.html` | `/manuscripts-lab` | Later backed by manuscript task tables and private storage. |
| `hadith-research-sites.html` | `/research-sites` | Back by `research_sites` and categories. |
| `student-dashboard.html` | `/student` or `/dashboard/student` | Public bridge page should redirect to authenticated student dashboard. |
| `dashboards/dashboard-student.html` | `/dashboard/student` | Authenticated student dashboard. |
| `dashboards/dashboard-admin.html` | `/dashboard/admin` | Authenticated admin dashboard. |
| `dashboards/dashboard-faculty.html` | `/dashboard/faculty` | Authenticated faculty dashboard. |
| `dashboards/research-sites-admin.html` | `/dashboard/admin/research-sites` | Authenticated content/librarian admin module. |

## Required Redirects

- `/index.html` -> `/`
- `/about.html` -> `/about`
- `/programs.html` -> `/programs`
- `/admissions.html` -> `/admissions`
- `/student-dashboard.html` -> `/dashboard/student`
- `/dashboards/dashboard-student.html` -> `/dashboard/student`
- `/dashboards/dashboard-admin.html` -> `/dashboard/admin`
- `/dashboards/dashboard-faculty.html` -> `/dashboard/faculty`
- `/dashboards/research-sites-admin.html` -> `/dashboard/admin/research-sites`

## Phase 1 Scope

The first implementation phase should:

- Initialize Next.js with App Router, TypeScript strict mode, ESLint, Vitest, Playwright, Zod, React Hook Form, Supabase libraries, and local Supabase CLI dependency.
- Move static assets to `public/assets`.
- Preserve existing visual identity through global CSS and reusable components.
- Add route redirects for old `.html` paths.
- Create initial public pages and dashboard route shells.
- Add `.env.example` and safe environment validation.
- Add docs and implementation status.
- Run lint, typecheck, tests, and build.

Database, auth, RLS, real dashboard CRUD, Supabase project linking, Vercel environment variables, Zoom, and email integrations are intentionally not marked complete until the required human-authenticated setup is available.
