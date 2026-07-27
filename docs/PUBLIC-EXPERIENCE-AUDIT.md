# Public Experience Audit

Date: 2026-07-27  
Branch: `feat/full-college-platform`

## Scope and constraints

This audit covers the public Next.js experience, authentication shell, and dashboard presentation. It does not change Supabase tables, migrations, RLS, Teaching Operations, the digital library, certificates, or mobile applications.

## Existing routes

### Public routes backed by Supabase

- `/`: CMS hero with a validated local fallback; published academic programs come from Supabase.
- `/programs`: published academic programs.
- `/programs/[slug]`: published program details and courses.
- `/faculty` and `/scientific-body/faculty`: published faculty profiles.
- `/faculty/[slug]`: published faculty profile details.

### Public routes backed by curated application content

- Existing single-level pages: `/about`, `/admissions`, `/courses`, `/library`, `/publications`, `/news`, `/contact`, `/ijazat`, `/takhrij-lab`, `/manuscripts-lab`, and `/research-sites`.
- New information architecture routes: `/about/*`, `/research/*`, `/scientific-body/*`, `/journal/*`, `/diplomas`, `/curricula`, `/fees`, `/live`, and `/store`.
- When approved content is unavailable, these routes render explicit empty states rather than invented names, prices, research, broadcasts, links, or accreditation claims.

### Authentication and dashboards

- `/login` uses Supabase magic-link authentication. There is no password-reset page because the current authentication flow does not issue application passwords.
- `/dashboard/admin/*`, `/dashboard/faculty/*`, and `/dashboard/student/*` are role-gated and use real Supabase data where implemented.

## Duplicate and legacy routes

- `legacy-static/` is an archived reference and is not served by the Next.js application.
- `/faculty` remains available for compatibility and redirects at the index level to `/scientific-body/faculty`.
- `/publications` maps to `/journal`.
- `/takhrij-lab` maps to `/research/takhrij-lab`.
- `/research-sites` maps to `/research/hadith-sites`.
- `.html` routes in `next.config.ts` preserve the most important legacy entry points.
- Old program slugs are not guessed into bachelor/master/doctorate equivalence because the source content does not establish that mapping.

## Broken or misleading links found

- The previous footer and legacy static files contained social links with `href="#"`. They are not reproduced because no verified public social URLs are stored in the current application.
- The previous header linked to sections whose names no longer matched the requested information architecture.
- Legacy static pages mention features such as library and certificates that are outside this phase. They remain archived and are not promoted in the new navigation.

## Hardcoded content

- General page titles, leads, navigation labels, empty-state explanations, and the university name are application content.
- No faculty names, prices, research items, news, broadcasts, university URLs, accreditation statements, or paid products were added.
- Research-site names requested by management are shown without links until a verified CMS URL exists.

## Reusable components

- `PublicLayout`, `Header`, `Footer`, `PageHero`, and `ProgramGrid`.
- Supabase content readers in `src/lib/content` and `src/lib/academic`.
- `DashboardLayout` and the existing role-specific module lists.
- Existing CSS card, grid, form, table, and status primitives.

## Reorganization decisions

- The desktop header keeps the seven management-requested categories.
- Dense categories use accessible native `details` menus; live and student login remain independent actions.
- Mobile navigation prioritizes login and live access, then presents grouped sections.
- The homepage is an editorial journey rather than a sitemap: hero, quick access, programs, flexible learning, research, scientific body, journal, news, university, and CTA.
- `/store` is a catalog-only empty state until real products are published.
- `/live` shows an honest unavailable state until a real meeting URL or recording is published.
- Dashboard sidebars are grouped by available role-area modules without adding new permissions or routes.

## Deferred

- Verified social and university links: no trusted URLs are present.
- University logo and accreditation copy: no separately authorized asset or approved claim is present.
- Public payment, checkout, paid downloads, Zoom OAuth, and live-provider integration: explicitly out of scope.
- Rich editorial content for testimonials, councils, advisory board, research, news, and products: requires approved CMS content.
- Password recovery UI: not applicable to the current passwordless magic-link authentication flow.

