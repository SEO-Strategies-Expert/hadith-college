# RLS Policies

RLS is enabled in the first migration for:

- `profiles`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `audit_logs`
- `site_settings`
- `media_files`
- `pages`
- `page_sections`
- `content_revisions`
- `seo_metadata`
- `navigation_items`
- `faqs`
- `contact_messages`

## Public Reads

Anonymous/public users can read:

- Published, non-deleted `pages`.
- Visible, published `page_sections` whose parent page is published.
- Public `site_settings`.
- Public `media_files`.
- Visible navigation items without required permissions.
- Published FAQs.

## Admin Writes

Content write operations require `content.manage`.

User/role management requires `users.manage`.

Audit log reads require `audit.read`.

Contact message reads require `contact.read`; updates require `contact.manage`.

## First RLS-Protected Cycle

The homepage hero editor writes to `page_sections` through a Server Action. RLS should allow the write only for authenticated users with `content.manage`, or `super_admin` through `has_permission()`.

## Pending RLS Tests

The following SQL tests are pending until a linked Supabase project or local database is available:

- Visitor cannot read drafts.
- Content editor can update content but cannot manage users.
- Student cannot access admin tables.
- Suspended user cannot use role helper functions.
