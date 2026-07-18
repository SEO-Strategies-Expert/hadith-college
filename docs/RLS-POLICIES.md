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
- `faculty_profiles`
- `academic_programs`
- `program_levels`
- `courses`
- `course_learning_outcomes`
- `course_prerequisites`
- `program_courses`
- `academic_terms`
- `student_profiles`
- `cohorts`
- `course_sections`
- `course_instructors`
- `enrollments`
- `course_modules`
- `lessons`
- `lesson_resources`
- `lesson_progress`

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

Academic Core policies are covered by migration-level tests and the remote verification script:

- Student A sees only their own `student_profiles`, `enrollments`, and accessible lessons.
- A student cannot read lessons for a section where they are not actively enrolled.
- Instructors can manage modules and lessons only for assigned sections.
- Instructors cannot update `academic_programs`.
- Academic admins can manage programs, courses, terms, cohorts, sections, and enrollments.
- Content editors do not receive academic/student permissions.
- Visitors can read only published `academic_programs` and published faculty profiles.
- Suspended users are rejected by middleware before dashboard access and by helper functions that require active `profiles.status`.

Run after pushing the Academic Core migration:

```bash
npm run verify:academic-core
```

Storage RLS:

- `public-assets`: public read, managed upload only.
- `faculty-avatars`: public read for published images, managed upload only.
- `course-materials`: private read through enrollment/instructor/admin checks and signed URL workflow.
