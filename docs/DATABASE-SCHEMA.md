# Database Schema

Current migration:

- `supabase/migrations/20260718000100_accounts_roles_cms.sql`

Applied remotely to Supabase project ref `iqowychratwvykhlkfhu`.

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
