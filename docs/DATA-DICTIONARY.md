# Data Dictionary

## Users

- `profiles.status`: `active`, `invited`, `suspended`, `archived`.
- `roles.slug`: system role key. Current roles include `super_admin`, `college_admin`, `academic_admin`, `content_editor`, `admissions_officer`, `finance_officer`, `librarian`, `instructor`, `teaching_assistant`, `reviewer`, `student`.
- `audit_logs`: records role and status changes plus sensitive academic operations.

## Faculty

- `faculty_profiles.user_id`: optional Auth account link.
- `profile_image`: storage path, usually `faculty-avatars/...`.
- `cv_file`: storage path, usually `public-assets/...`.
- `status`: `draft`, `pending_review`, `published`, `archived`.

## Students

- `student_profiles.student_number`: unique academic identifier.
- `academic_status`: `applicant`, `accepted`, `active`, `suspended`, `withdrawn`, `graduated`, `archived`.
- `fee_status`: simple text status for MVP.
- `program_id` and `current_level_id`: current academic placement.

## Academic Programs

- `academic_programs.slug`: public route key under `/programs/[slug]`.
- `status`: only `published` records are public.
- `program_levels`: ordered levels inside a program.
- `program_courses`: links courses to programs and optional levels.

## Courses And Sections

- `courses.code`: unique course code.
- `course_sections`: concrete delivery instance for a course inside a term/cohort.
- `course_instructors`: assigns faculty to sections.
- `enrollments`: assigns students to sections; unique by `(section_id, student_id)` and capacity-checked.

## Lessons

- `course_modules`: ordered course content blocks.
- `lessons`: text/video/audio/pdf/link/reference capable lesson records.
- `lesson_resources`: normalized lesson resource list.
- `lesson_progress`: per-student progress with `started_at`, `completed_at`, `progress_percentage`, `last_position`, and `is_completed`.
