# Database Schema

Current migration:

- `supabase/migrations/20260718000100_accounts_roles_cms.sql`
- `supabase/migrations/20260718001000_academic_core_mvp.sql`

Applied remotely to Supabase project ref `iqowychratwvykhlkfhu`.

Both CMS Foundation and Academic Core MVP migrations are applied remotely. `verify:supabase-cms` and `verify:academic-core` pass against the real Supabase project.

## Accounts And Permissions

- `profiles`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `audit_logs`

Helper functions:

- `has_role(role_slug, target_user_id)`
- `has_permission(permission_slug, target_user_id)`
- `is_admin(target_user_id)`
- `owns_record(record_user_id)`
- `handle_new_user()`

The auth trigger creates a matching `profiles` row when a Supabase Auth user is created.

## CMS

- `site_settings`
- `media_files`
- `pages`
- `page_sections`
- `content_revisions`
- `seo_metadata`
- `navigation_items`
- `faqs`
- `contact_messages`

The first implemented CMS cycle edits the homepage hero section:

`/dashboard/admin/content/home` -> `page_sections.content_json` -> `/`

Verified by `scripts/verify-supabase-cms.ts`, which creates a temporary content editor, updates the published homepage hero through RLS, verifies anonymous public read access, verifies anonymous users do not read drafts, restores the previous hero content, and removes the temporary user.

## Seed Data

Current seed file:

- `supabase/seed.sql`

Seed data includes demo roles, permissions, public identity settings, a homepage page record, a homepage hero section, and navigation items. Demo rows use `is_demo = true`.

Academic seed data moves the public program catalog into Supabase:

- `foundation`
- `takhrij`
- `manuscripts`
- `higher`
- `ijazat`
- `short-courses`

It also creates starter levels, courses, and program-course links.

## Academic Core MVP

User and role administration:

- `profiles`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `audit_logs`

Faculty:

- `faculty_profiles`

Students:

- `student_profiles`

Programs and courses:

- `academic_programs`
- `program_levels`
- `courses`
- `course_learning_outcomes`
- `course_prerequisites`
- `program_courses`

Terms, cohorts, sections, and enrollment:

- `academic_terms`
- `cohorts`
- `course_sections`
- `course_instructors`
- `enrollments`

Learning content:

- `course_modules`
- `lessons`
- `lesson_resources`
- `lesson_progress`

Storage buckets:

- `public-assets`
- `faculty-avatars`
- `course-materials`

Verification script:

- `npm run verify:academic-core`

The script creates temporary users with random in-memory passwords, creates a program/course/section, assigns an instructor, enrolls a student, publishes a lesson, records progress, checks negative RLS cases, and cleans up.
