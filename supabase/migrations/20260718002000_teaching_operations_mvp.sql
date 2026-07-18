do $$
begin
  create type public.teaching_record_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.announcement_target_type as enum ('all', 'program', 'level', 'cohort', 'section', 'course', 'role', 'user');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.announcement_priority as enum ('low', 'normal', 'high', 'urgent');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.submission_status as enum ('draft', 'submitted', 'late', 'graded', 'returned');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.question_type as enum ('multiple_choice', 'true_false', 'multiple_select', 'short_answer', 'essay');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.quiz_attempt_status as enum ('in_progress', 'submitted', 'graded', 'expired');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.attendance_status as enum ('present', 'absent', 'late', 'excused');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.attendance_request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.meeting_mode as enum ('onsite', 'online', 'hybrid');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.notification_channel as enum ('in_app', 'email');
exception when duplicate_object then null;
end $$;

insert into public.permissions (slug, name_ar, description_ar)
values
  ('teaching.manage', 'إدارة التشغيل التدريسي', 'إدارة الواجبات والاختبارات والحضور والدرجات'),
  ('grades.manage', 'إدارة الدرجات', 'إدخال ونشر وقفل الدرجات الأكاديمية'),
  ('calendar.manage', 'إدارة الجداول', 'إدارة المحاضرات والجداول التعليمية'),
  ('notifications.manage', 'إدارة الإشعارات', 'إعداد ومعالجة إشعارات المنصة')
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  description_ar = excluded.description_ar,
  updated_at = now();

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug in ('super_admin')
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('teaching.manage', 'grades.manage', 'calendar.manage', 'notifications.manage')
where r.slug in ('college_admin', 'academic_admin')
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('teaching.manage', 'grades.manage', 'calendar.manage')
where r.slug in ('instructor', 'teaching_assistant')
on conflict do nothing;

create or replace function public.current_student_id(target_user_id uuid default auth.uid())
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select sp.id
  from public.student_profiles sp
  join public.profiles p on p.id = sp.user_id
  where sp.user_id = target_user_id
    and p.status = 'active'
    and p.deleted_at is null
  limit 1;
$$;

create or replace function public.current_faculty_id(target_user_id uuid default auth.uid())
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select fp.id
  from public.faculty_profiles fp
  join public.profiles p on p.id = fp.user_id
  where fp.user_id = target_user_id
    and p.status = 'active'
    and p.deleted_at is null
  limit 1;
$$;

create or replace function public.is_active_platform_user(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_user_id
      and p.status = 'active'
      and p.deleted_at is null
  );
$$;

create or replace function public.student_section_ids(target_student_id uuid)
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select e.section_id
  from public.enrollments e
  where e.student_id = target_student_id
    and e.status = 'active';
$$;

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  priority public.announcement_priority not null default 'normal',
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid references public.profiles(id),
  status public.teaching_record_status not null default 'draft',
  is_pinned boolean not null default false,
  section_id uuid references public.course_sections(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint announcements_publish_order check (expires_at is null or published_at is null or expires_at >= published_at)
);

create trigger announcements_set_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

create table if not exists public.announcement_targets (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  target_type public.announcement_target_type not null,
  target_id text,
  created_at timestamptz not null default now(),
  unique (announcement_id, target_type, target_id)
);

create table if not exists public.announcement_reads (
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (announcement_id, user_id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  section_id uuid not null references public.course_sections(id) on delete cascade,
  title text not null,
  instructions text,
  available_from timestamptz,
  due_at timestamptz,
  points numeric(8,2) not null default 100,
  allow_late_submissions boolean not null default false,
  status public.teaching_record_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint assignments_points_nonnegative check (points >= 0),
  constraint assignments_due_order check (due_at is null or available_from is null or due_at >= available_from)
);

create index if not exists assignments_section_status_idx on public.assignments(section_id, status, due_at);

create trigger assignments_set_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

create table if not exists public.assignment_resources (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  title text not null,
  resource_url text,
  storage_path text,
  resource_type text not null default 'link',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  body_text text,
  status public.submission_status not null default 'draft',
  submitted_at timestamptz,
  is_late boolean not null default false,
  grade numeric(8,2),
  graded_by uuid references public.profiles(id),
  graded_at timestamptz,
  grade_published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id),
  constraint assignment_submissions_grade_nonnegative check (grade is null or grade >= 0)
);

create trigger assignment_submissions_set_updated_at
before update on public.assignment_submissions
for each row execute function public.set_updated_at();

create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.assignment_submissions(id) on delete cascade,
  file_name text not null,
  storage_path text,
  file_url text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  constraint submission_files_size_nonnegative check (size_bytes is null or size_bytes >= 0)
);

create table if not exists public.submission_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.assignment_submissions(id) on delete cascade,
  feedback_text text not null,
  score numeric(8,2),
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger submission_feedback_set_updated_at
before update on public.submission_feedback
for each row execute function public.set_updated_at();

create table if not exists public.question_banks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.course_sections(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger question_banks_set_updated_at
before update on public.question_banks
for each row execute function public.set_updated_at();

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  bank_id uuid not null references public.question_banks(id) on delete cascade,
  question_type public.question_type not null,
  prompt text not null,
  points numeric(8,2) not null default 1,
  correct_answer text,
  explanation text,
  status public.teaching_record_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_points_positive check (points > 0)
);

create trigger questions_set_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  section_id uuid not null references public.course_sections(id) on delete cascade,
  title text not null,
  instructions text,
  duration_minutes integer,
  available_from timestamptz,
  available_until timestamptz,
  attempts_allowed integer not null default 1,
  passing_grade numeric(8,2) not null default 60,
  shuffle_questions boolean not null default false,
  shuffle_options boolean not null default false,
  show_results boolean not null default true,
  show_correct_answers boolean not null default false,
  status public.teaching_record_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quizzes_duration_positive check (duration_minutes is null or duration_minutes > 0),
  constraint quizzes_attempts_positive check (attempts_allowed > 0),
  constraint quizzes_available_order check (available_until is null or available_from is null or available_until >= available_from)
);

create index if not exists quizzes_section_status_idx on public.quizzes(section_id, status, available_until);

create trigger quizzes_set_updated_at
before update on public.quizzes
for each row execute function public.set_updated_at();

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  points numeric(8,2) not null default 1,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (quiz_id, question_id),
  constraint quiz_questions_points_positive check (points > 0)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  attempt_number integer not null,
  status public.quiz_attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  expires_at timestamptz,
  score numeric(8,2),
  auto_score numeric(8,2),
  manual_score numeric(8,2),
  graded_by uuid references public.profiles(id),
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quiz_id, student_id, attempt_number),
  constraint quiz_attempt_number_positive check (attempt_number > 0)
);

create trigger quiz_attempts_set_updated_at
before update on public.quiz_attempts
for each row execute function public.set_updated_at();

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_text text,
  selected_option_ids uuid[] not null default '{}',
  is_correct boolean,
  auto_score numeric(8,2),
  manual_score numeric(8,2),
  feedback text,
  graded_by uuid references public.profiles(id),
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create trigger quiz_answers_set_updated_at
before update on public.quiz_answers
for each row execute function public.set_updated_at();

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  title text not null,
  session_at timestamptz not null default now(),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger class_sessions_set_updated_at
before update on public.class_sessions
for each row execute function public.set_updated_at();

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid not null references public.class_sessions(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  status public.attendance_status not null default 'absent',
  notes text,
  recorded_by uuid references public.profiles(id),
  recorded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_session_id, student_id)
);

create trigger attendance_records_set_updated_at
before update on public.attendance_records
for each row execute function public.set_updated_at();

create table if not exists public.attendance_adjustment_requests (
  id uuid primary key default gen_random_uuid(),
  attendance_record_id uuid references public.attendance_records(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  requested_status public.attendance_status not null,
  reason text not null,
  status public.attendance_request_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger attendance_adjustment_requests_set_updated_at
before update on public.attendance_adjustment_requests
for each row execute function public.set_updated_at();

create table if not exists public.grade_categories (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  slug text not null,
  name_ar text not null,
  weight_percentage numeric(5,2) not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, slug),
  constraint grade_categories_weight_range check (weight_percentage between 0 and 100)
);

create trigger grade_categories_set_updated_at
before update on public.grade_categories
for each row execute function public.set_updated_at();

create table if not exists public.grade_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.grade_categories(id) on delete cascade,
  title text not null,
  source_type text,
  source_id uuid,
  points numeric(8,2) not null default 100,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint grade_items_points_positive check (points > 0)
);

create trigger grade_items_set_updated_at
before update on public.grade_items
for each row execute function public.set_updated_at();

create table if not exists public.student_grades (
  id uuid primary key default gen_random_uuid(),
  grade_item_id uuid not null references public.grade_items(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  score numeric(8,2),
  feedback text,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (grade_item_id, student_id),
  constraint student_grades_score_nonnegative check (score is null or score >= 0)
);

create trigger student_grades_set_updated_at
before update on public.student_grades
for each row execute function public.set_updated_at();

create table if not exists public.final_grades (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  final_score numeric(8,2),
  letter_grade text,
  is_locked boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  locked_by uuid references public.profiles(id),
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, student_id)
);

create trigger final_grades_set_updated_at
before update on public.final_grades
for each row execute function public.set_updated_at();

create table if not exists public.grade_publications (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  published_by uuid references public.profiles(id),
  published_at timestamptz not null default now(),
  notes text
);

create table if not exists public.class_meetings (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Asia/Qatar',
  meeting_mode public.meeting_mode not null default 'online',
  location text,
  online_meeting_url text,
  recording_url text,
  status public.teaching_record_status not null default 'published',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_meetings_time_order check (ends_at > starts_at)
);

create index if not exists class_meetings_section_starts_idx on public.class_meetings(section_id, starts_at);

create trigger class_meetings_set_updated_at
before update on public.class_meetings
for each row execute function public.set_updated_at();

create table if not exists public.meeting_occurrences (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.class_meetings(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.teaching_record_status not null default 'published',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.meeting_attendance_links (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.class_meetings(id) on delete cascade,
  class_session_id uuid not null references public.class_sessions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (meeting_id, class_session_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  queued_at timestamptz not null default now(),
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_read_idx on public.notifications(user_id, read_at, created_at desc);

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  in_app_enabled boolean not null default true,
  email_enabled boolean not null default false,
  event_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create trigger notification_preferences_set_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  channel public.notification_channel not null default 'in_app',
  status text not null default 'queued',
  provider text,
  provider_message_id text,
  error_message text,
  attempts integer not null default 0,
  next_attempt_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.can_read_announcement(target_announcement_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with target as (
    select a.*
    from public.announcements a
    where a.id = target_announcement_id
      and a.status = 'published'
      and (a.published_at is null or a.published_at <= now())
      and (a.expires_at is null or a.expires_at > now())
  ),
  profile as (
    select p.id, p.status
    from public.profiles p
    where p.id = target_user_id
  ),
  student as (
    select sp.*
    from public.student_profiles sp
    where sp.user_id = target_user_id
    limit 1
  )
  select exists (
    select 1
    from target t
    join profile p on p.status = 'active'
    where public.has_permission('academic.manage', target_user_id)
      or public.is_section_instructor(t.section_id, target_user_id)
      or exists (
        select 1
        from public.announcement_targets at
        where at.announcement_id = t.id
          and (
            at.target_type = 'all'
            or (at.target_type = 'user' and at.target_id = target_user_id::text)
            or (at.target_type = 'role' and public.has_role(at.target_id, target_user_id))
            or (at.target_type = 'section' and (public.is_student_enrolled(at.target_id::uuid, target_user_id) or public.is_section_instructor(at.target_id::uuid, target_user_id)))
            or (at.target_type = 'course' and exists (select 1 from public.course_sections cs where cs.course_id = at.target_id::uuid and (public.is_student_enrolled(cs.id, target_user_id) or public.is_section_instructor(cs.id, target_user_id))))
            or (at.target_type = 'program' and exists (select 1 from student s where s.program_id = at.target_id::uuid))
            or (at.target_type = 'level' and exists (select 1 from student s where s.current_level_id = at.target_id::uuid))
            or (at.target_type = 'cohort' and exists (select 1 from public.enrollments e join public.course_sections cs on cs.id = e.section_id join student s on s.id = e.student_id where cs.cohort_id = at.target_id::uuid and e.status = 'active'))
          )
      )
  );
$$;

create or replace function public.can_access_assignment(target_assignment_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignments a
    where a.id = target_assignment_id
      and (
        public.has_permission('academic.manage', target_user_id)
        or public.is_section_instructor(a.section_id, target_user_id)
        or (a.status = 'published' and (a.available_from is null or a.available_from <= now()) and public.is_student_enrolled(a.section_id, target_user_id))
      )
  );
$$;

create or replace function public.can_submit_assignment(target_assignment_id uuid, target_student_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.assignments a
    join public.student_profiles sp on sp.id = target_student_id
    join public.profiles p on p.id = sp.user_id
    where a.id = target_assignment_id
      and sp.user_id = target_user_id
      and p.status = 'active'
      and p.deleted_at is null
      and a.status = 'published'
      and public.is_student_enrolled(a.section_id, target_user_id)
      and (a.available_from is null or a.available_from <= now())
      and (a.due_at is null or a.due_at >= now() or a.allow_late_submissions)
  );
$$;

create or replace function public.can_access_quiz(target_quiz_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.quizzes q
    where q.id = target_quiz_id
      and (
        public.has_permission('academic.manage', target_user_id)
        or public.is_section_instructor(q.section_id, target_user_id)
        or (
          q.status = 'published'
          and (q.available_from is null or q.available_from <= now())
          and (q.available_until is null or q.available_until >= now())
          and public.is_student_enrolled(q.section_id, target_user_id)
        )
      )
  );
$$;

create or replace function public.can_start_quiz_attempt(target_quiz_id uuid, target_student_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.quizzes q
    join public.student_profiles sp on sp.id = target_student_id
    join public.profiles p on p.id = sp.user_id
    where q.id = target_quiz_id
      and sp.user_id = target_user_id
      and p.status = 'active'
      and p.deleted_at is null
      and q.status = 'published'
      and (q.available_from is null or q.available_from <= now())
      and (q.available_until is null or q.available_until >= now())
      and public.is_student_enrolled(q.section_id, target_user_id)
      and (
        select count(*)
        from public.quiz_attempts qa
        where qa.quiz_id = q.id
          and qa.student_id = target_student_id
      ) < q.attempts_allowed
  );
$$;

create or replace function public.autograde_quiz_attempt(target_attempt_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  answer_row record;
  correct_ids uuid[];
  answer_ids uuid[];
  earned numeric(8,2);
  total_auto numeric(8,2) := 0;
begin
  for answer_row in
    select qa.id as answer_id, qa.selected_option_ids, qa.answer_text, q.question_type, q.correct_answer, qq.points
    from public.quiz_answers qa
    join public.questions q on q.id = qa.question_id
    join public.quiz_attempts qat on qat.id = qa.attempt_id
    join public.quiz_questions qq on qq.quiz_id = qat.quiz_id and qq.question_id = q.id
    where qa.attempt_id = target_attempt_id
  loop
    earned := null;
    if answer_row.question_type in ('multiple_choice', 'true_false', 'multiple_select') then
      select array_agg(qo.id order by qo.id) into correct_ids
      from public.question_options qo
      where qo.question_id in (select question_id from public.quiz_answers where id = answer_row.answer_id)
        and qo.is_correct = true;
      select array_agg(item order by item) into answer_ids
      from unnest(answer_row.selected_option_ids) as item;
      earned := case when coalesce(correct_ids, '{}') = coalesce(answer_ids, '{}') then answer_row.points else 0 end;
    elsif answer_row.question_type = 'short_answer' then
      earned := case when lower(trim(coalesce(answer_row.answer_text, ''))) = lower(trim(coalesce(answer_row.correct_answer, ''))) then answer_row.points else 0 end;
    end if;

    if earned is not null then
      update public.quiz_answers
      set auto_score = earned,
          is_correct = earned = answer_row.points,
          updated_at = now()
      where id = answer_row.answer_id;
      total_auto := total_auto + earned;
    end if;
  end loop;

  update public.quiz_attempts
  set auto_score = total_auto,
      score = total_auto + coalesce(manual_score, 0),
      status = case when status = 'submitted' then 'graded' else status end,
      updated_at = now()
  where id = target_attempt_id;
end;
$$;

create or replace function public.create_in_app_notification(target_user_id uuid, event text, title_text text, body_text text, entity text default null, entity_uuid uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  notification_uuid uuid;
begin
  insert into public.notifications (user_id, event_type, title, body, entity_type, entity_id)
  values (target_user_id, event, title_text, body_text, entity, entity_uuid)
  returning id into notification_uuid;

  insert into public.notification_deliveries (notification_id, channel, status, delivered_at)
  values (notification_uuid, 'in_app', 'delivered', now());

  return notification_uuid;
end;
$$;

create or replace function public.audit_attendance_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, old_values, new_values)
    values (auth.uid(), 'attendance.update', 'attendance_record', new.id, to_jsonb(old), to_jsonb(new));
  end if;
  return new;
end;
$$;

create trigger attendance_records_audit_update
after update on public.attendance_records
for each row execute function public.audit_attendance_change();

alter table public.announcements enable row level security;
alter table public.announcement_targets enable row level security;
alter table public.announcement_reads enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_resources enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.submission_files enable row level security;
alter table public.submission_feedback enable row level security;
alter table public.question_banks enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.class_sessions enable row level security;
alter table public.attendance_records enable row level security;
alter table public.attendance_adjustment_requests enable row level security;
alter table public.grade_categories enable row level security;
alter table public.grade_items enable row level security;
alter table public.student_grades enable row level security;
alter table public.final_grades enable row level security;
alter table public.grade_publications enable row level security;
alter table public.class_meetings enable row level security;
alter table public.meeting_occurrences enable row level security;
alter table public.meeting_attendance_links enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_deliveries enable row level security;

create policy "announcements_select_targeted" on public.announcements
for select using (public.can_read_announcement(id) or public.has_permission('academic.manage') or public.is_section_instructor(section_id));
create policy "announcements_manage_admin_or_instructor" on public.announcements
for all using (public.has_permission('academic.manage') or (section_id is not null and public.is_section_instructor(section_id) and public.has_permission('teaching.manage')))
with check (public.has_permission('academic.manage') or (section_id is not null and public.is_section_instructor(section_id) and public.has_permission('teaching.manage')));

create policy "announcement_targets_select_with_announcement" on public.announcement_targets
for select using (public.can_read_announcement(announcement_id) or public.has_permission('academic.manage'));
create policy "announcement_targets_manage_authorized" on public.announcement_targets
for all using (exists (select 1 from public.announcements a where a.id = announcement_targets.announcement_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id))))
with check (exists (select 1 from public.announcements a where a.id = announcement_targets.announcement_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id))));

create policy "announcement_reads_self" on public.announcement_reads
for select using (user_id = auth.uid() or public.has_permission('academic.manage'));
create policy "announcement_reads_insert_self" on public.announcement_reads
for insert with check (user_id = auth.uid() and public.can_read_announcement(announcement_id));

create policy "assignments_select_authorized" on public.assignments
for select using (public.can_access_assignment(id));
create policy "assignments_manage_instructor" on public.assignments
for all using (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('teaching.manage')))
with check (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('teaching.manage')));

create policy "assignment_resources_select_authorized" on public.assignment_resources
for select using (public.can_access_assignment(assignment_id));
create policy "assignment_resources_manage_instructor" on public.assignment_resources
for all using (exists (select 1 from public.assignments a where a.id = assignment_resources.assignment_id and (public.has_permission('academic.manage') or (public.is_section_instructor(a.section_id) and public.has_permission('teaching.manage')))))
with check (exists (select 1 from public.assignments a where a.id = assignment_resources.assignment_id and (public.has_permission('academic.manage') or (public.is_section_instructor(a.section_id) and public.has_permission('teaching.manage')))));

create policy "assignment_submissions_select_owner_or_instructor" on public.assignment_submissions
for select using (
  exists (select 1 from public.student_profiles sp where sp.id = assignment_submissions.student_id and sp.user_id = auth.uid())
  or exists (select 1 from public.assignments a where a.id = assignment_submissions.assignment_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id)))
);
create policy "assignment_submissions_insert_student" on public.assignment_submissions
for insert with check (public.can_submit_assignment(assignment_id, student_id));
create policy "assignment_submissions_update_student_or_instructor" on public.assignment_submissions
for update using (
  (
    exists (select 1 from public.student_profiles sp where sp.id = assignment_submissions.student_id and sp.user_id = auth.uid())
    and status = 'draft'
    and public.can_submit_assignment(assignment_id, student_id)
  )
  or exists (select 1 from public.assignments a where a.id = assignment_submissions.assignment_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id)))
)
with check (
  (
    exists (select 1 from public.student_profiles sp where sp.id = assignment_submissions.student_id and sp.user_id = auth.uid())
    and public.can_submit_assignment(assignment_id, student_id)
  )
  or exists (select 1 from public.assignments a where a.id = assignment_submissions.assignment_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id)))
);

create policy "submission_files_select_with_submission" on public.submission_files
for select using (exists (select 1 from public.assignment_submissions s where s.id = submission_files.submission_id));
create policy "submission_files_insert_owner" on public.submission_files
for insert with check (exists (select 1 from public.assignment_submissions s where s.id = submission_files.submission_id and exists (select 1 from public.student_profiles sp where sp.id = s.student_id and sp.user_id = auth.uid())));

create policy "submission_feedback_select_authorized" on public.submission_feedback
for select using (
  is_published
  and exists (select 1 from public.assignment_submissions s join public.student_profiles sp on sp.id = s.student_id where s.id = submission_feedback.submission_id and sp.user_id = auth.uid())
  or exists (select 1 from public.assignment_submissions s join public.assignments a on a.id = s.assignment_id where s.id = submission_feedback.submission_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id)))
);
create policy "submission_feedback_manage_instructor" on public.submission_feedback
for all using (exists (select 1 from public.assignment_submissions s join public.assignments a on a.id = s.assignment_id where s.id = submission_feedback.submission_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id))))
with check (exists (select 1 from public.assignment_submissions s join public.assignments a on a.id = s.assignment_id where s.id = submission_feedback.submission_id and (public.has_permission('academic.manage') or public.is_section_instructor(a.section_id))));

create policy "question_banks_select_instructor_admin" on public.question_banks
for select using (public.has_permission('academic.manage') or public.is_section_instructor(section_id));
create policy "question_banks_manage_instructor" on public.question_banks
for all using (public.has_permission('academic.manage') or (section_id is not null and public.is_section_instructor(section_id) and public.has_permission('teaching.manage')))
with check (public.has_permission('academic.manage') or (section_id is not null and public.is_section_instructor(section_id) and public.has_permission('teaching.manage')));

create policy "questions_select_authorized" on public.questions
for select using (
  exists (select 1 from public.question_banks qb where qb.id = questions.bank_id and (public.has_permission('academic.manage') or public.is_section_instructor(qb.section_id)))
  or exists (select 1 from public.quiz_questions qq join public.quizzes qz on qz.id = qq.quiz_id where qq.question_id = questions.id and public.can_access_quiz(qz.id) and qz.show_results)
);
create policy "questions_manage_instructor" on public.questions
for all using (exists (select 1 from public.question_banks qb where qb.id = questions.bank_id and (public.has_permission('academic.manage') or (public.is_section_instructor(qb.section_id) and public.has_permission('teaching.manage')))))
with check (exists (select 1 from public.question_banks qb where qb.id = questions.bank_id and (public.has_permission('academic.manage') or (public.is_section_instructor(qb.section_id) and public.has_permission('teaching.manage')))));

create policy "question_options_select_authorized" on public.question_options
for select using (exists (select 1 from public.questions q where q.id = question_options.question_id));
create policy "question_options_manage_instructor" on public.question_options
for all using (exists (select 1 from public.questions q join public.question_banks qb on qb.id = q.bank_id where q.id = question_options.question_id and (public.has_permission('academic.manage') or public.is_section_instructor(qb.section_id))))
with check (exists (select 1 from public.questions q join public.question_banks qb on qb.id = q.bank_id where q.id = question_options.question_id and (public.has_permission('academic.manage') or public.is_section_instructor(qb.section_id))));

create policy "quizzes_select_authorized" on public.quizzes
for select using (public.can_access_quiz(id));
create policy "quizzes_manage_instructor" on public.quizzes
for all using (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('teaching.manage')))
with check (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('teaching.manage')));

create policy "quiz_questions_select_authorized" on public.quiz_questions
for select using (exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id and public.can_access_quiz(q.id)));
create policy "quiz_questions_manage_instructor" on public.quiz_questions
for all using (exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id))))
with check (exists (select 1 from public.quizzes q where q.id = quiz_questions.quiz_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id))));

create policy "quiz_attempts_select_owner_or_instructor" on public.quiz_attempts
for select using (
  exists (select 1 from public.student_profiles sp where sp.id = quiz_attempts.student_id and sp.user_id = auth.uid())
  or exists (select 1 from public.quizzes q where q.id = quiz_attempts.quiz_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id)))
);
create policy "quiz_attempts_insert_student" on public.quiz_attempts
for insert with check (public.can_start_quiz_attempt(quiz_id, student_id));
create policy "quiz_attempts_update_owner_or_instructor" on public.quiz_attempts
for update using (
  exists (select 1 from public.student_profiles sp where sp.id = quiz_attempts.student_id and sp.user_id = auth.uid())
  or exists (select 1 from public.quizzes q where q.id = quiz_attempts.quiz_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id)))
)
with check (
  exists (select 1 from public.student_profiles sp where sp.id = quiz_attempts.student_id and sp.user_id = auth.uid())
  or exists (select 1 from public.quizzes q where q.id = quiz_attempts.quiz_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id)))
);

create policy "quiz_answers_select_owner_or_instructor" on public.quiz_answers
for select using (
  exists (select 1 from public.quiz_attempts qa join public.student_profiles sp on sp.id = qa.student_id where qa.id = quiz_answers.attempt_id and sp.user_id = auth.uid())
  or exists (select 1 from public.quiz_attempts qa join public.quizzes q on q.id = qa.quiz_id where qa.id = quiz_answers.attempt_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id)))
);
create policy "quiz_answers_upsert_owner_or_instructor" on public.quiz_answers
for all using (
  exists (select 1 from public.quiz_attempts qa join public.student_profiles sp on sp.id = qa.student_id where qa.id = quiz_answers.attempt_id and sp.user_id = auth.uid() and qa.status = 'in_progress')
  or exists (select 1 from public.quiz_attempts qa join public.quizzes q on q.id = qa.quiz_id where qa.id = quiz_answers.attempt_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id)))
)
with check (
  exists (select 1 from public.quiz_attempts qa join public.student_profiles sp on sp.id = qa.student_id where qa.id = quiz_answers.attempt_id and sp.user_id = auth.uid() and qa.status = 'in_progress')
  or exists (select 1 from public.quiz_attempts qa join public.quizzes q on q.id = qa.quiz_id where qa.id = quiz_answers.attempt_id and (public.has_permission('academic.manage') or public.is_section_instructor(q.section_id)))
);

create policy "class_sessions_select_authorized" on public.class_sessions
for select using (public.has_permission('academic.manage') or public.is_section_instructor(section_id) or public.is_student_enrolled(section_id));
create policy "class_sessions_manage_instructor" on public.class_sessions
for all using (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('calendar.manage')))
with check (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('calendar.manage')));

create policy "attendance_records_select_authorized" on public.attendance_records
for select using (
  exists (select 1 from public.student_profiles sp where sp.id = attendance_records.student_id and sp.user_id = auth.uid())
  or exists (select 1 from public.class_sessions cs where cs.id = attendance_records.class_session_id and (public.has_permission('academic.manage') or public.is_section_instructor(cs.section_id)))
);
create policy "attendance_records_manage_instructor" on public.attendance_records
for all using (exists (select 1 from public.class_sessions cs where cs.id = attendance_records.class_session_id and (public.has_permission('academic.manage') or public.is_section_instructor(cs.section_id))))
with check (exists (select 1 from public.class_sessions cs where cs.id = attendance_records.class_session_id and (public.has_permission('academic.manage') or public.is_section_instructor(cs.section_id))));

create policy "attendance_requests_select_authorized" on public.attendance_adjustment_requests
for select using (
  exists (select 1 from public.student_profiles sp where sp.id = attendance_adjustment_requests.student_id and sp.user_id = auth.uid())
  or public.has_permission('academic.manage')
);
create policy "attendance_requests_insert_student" on public.attendance_adjustment_requests
for insert with check (exists (select 1 from public.student_profiles sp where sp.id = attendance_adjustment_requests.student_id and sp.user_id = auth.uid()));
create policy "attendance_requests_manage_admin" on public.attendance_adjustment_requests
for update using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "grade_categories_select_authorized" on public.grade_categories
for select using (public.has_permission('academic.manage') or public.is_section_instructor(section_id) or public.is_student_enrolled(section_id));
create policy "grade_categories_manage_instructor" on public.grade_categories
for all using (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('grades.manage')))
with check (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('grades.manage')));

create policy "grade_items_select_authorized" on public.grade_items
for select using (exists (select 1 from public.grade_categories gc where gc.id = grade_items.category_id and (public.has_permission('academic.manage') or public.is_section_instructor(gc.section_id) or (grade_items.is_published and public.is_student_enrolled(gc.section_id)))));
create policy "grade_items_manage_instructor" on public.grade_items
for all using (exists (select 1 from public.grade_categories gc where gc.id = grade_items.category_id and (public.has_permission('academic.manage') or (public.is_section_instructor(gc.section_id) and public.has_permission('grades.manage')))))
with check (exists (select 1 from public.grade_categories gc where gc.id = grade_items.category_id and (public.has_permission('academic.manage') or (public.is_section_instructor(gc.section_id) and public.has_permission('grades.manage')))));

create policy "student_grades_select_published_or_staff" on public.student_grades
for select using (
  (is_published and exists (select 1 from public.student_profiles sp where sp.id = student_grades.student_id and sp.user_id = auth.uid()))
  or exists (select 1 from public.grade_items gi join public.grade_categories gc on gc.id = gi.category_id where gi.id = student_grades.grade_item_id and (public.has_permission('academic.manage') or public.is_section_instructor(gc.section_id)))
);
create policy "student_grades_manage_instructor" on public.student_grades
for all using (exists (select 1 from public.grade_items gi join public.grade_categories gc on gc.id = gi.category_id where gi.id = student_grades.grade_item_id and (public.has_permission('academic.manage') or (public.is_section_instructor(gc.section_id) and public.has_permission('grades.manage')))))
with check (exists (select 1 from public.grade_items gi join public.grade_categories gc on gc.id = gi.category_id where gi.id = student_grades.grade_item_id and (public.has_permission('academic.manage') or (public.is_section_instructor(gc.section_id) and public.has_permission('grades.manage')))));

create policy "final_grades_select_published_or_staff" on public.final_grades
for select using (
  (is_published and exists (select 1 from public.student_profiles sp where sp.id = final_grades.student_id and sp.user_id = auth.uid()))
  or public.has_permission('academic.manage')
  or public.is_section_instructor(section_id)
);
create policy "final_grades_manage_instructor" on public.final_grades
for all using (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('grades.manage') and is_locked = false))
with check (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('grades.manage') and is_locked = false));

create policy "grade_publications_select_staff" on public.grade_publications
for select using (public.has_permission('academic.manage') or public.is_section_instructor(section_id));
create policy "grade_publications_insert_staff" on public.grade_publications
for insert with check (public.has_permission('academic.manage') or public.is_section_instructor(section_id));

create policy "class_meetings_select_authorized" on public.class_meetings
for select using (public.has_permission('academic.manage') or public.is_section_instructor(section_id) or (status = 'published' and public.is_student_enrolled(section_id)));
create policy "class_meetings_manage_instructor" on public.class_meetings
for all using (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('calendar.manage')))
with check (public.has_permission('academic.manage') or (public.is_section_instructor(section_id) and public.has_permission('calendar.manage')));

create policy "meeting_occurrences_select_with_meeting" on public.meeting_occurrences
for select using (exists (select 1 from public.class_meetings cm where cm.id = meeting_occurrences.meeting_id));
create policy "meeting_occurrences_manage_with_meeting" on public.meeting_occurrences
for all using (exists (select 1 from public.class_meetings cm where cm.id = meeting_occurrences.meeting_id and (public.has_permission('academic.manage') or public.is_section_instructor(cm.section_id))))
with check (exists (select 1 from public.class_meetings cm where cm.id = meeting_occurrences.meeting_id and (public.has_permission('academic.manage') or public.is_section_instructor(cm.section_id))));

create policy "meeting_attendance_links_select_with_meeting" on public.meeting_attendance_links
for select using (exists (select 1 from public.class_meetings cm where cm.id = meeting_attendance_links.meeting_id));
create policy "meeting_attendance_links_manage_staff" on public.meeting_attendance_links
for all using (exists (select 1 from public.class_meetings cm where cm.id = meeting_attendance_links.meeting_id and (public.has_permission('academic.manage') or public.is_section_instructor(cm.section_id))))
with check (exists (select 1 from public.class_meetings cm where cm.id = meeting_attendance_links.meeting_id and (public.has_permission('academic.manage') or public.is_section_instructor(cm.section_id))));

create policy "notifications_select_self_or_admin" on public.notifications
for select using (user_id = auth.uid() or public.has_permission('notifications.manage'));
create policy "notifications_update_self_read" on public.notifications
for update using (user_id = auth.uid() or public.has_permission('notifications.manage'))
with check (user_id = auth.uid() or public.has_permission('notifications.manage'));
create policy "notifications_insert_staff" on public.notifications
for insert with check (public.has_permission('notifications.manage') or public.has_permission('academic.manage') or public.has_permission('teaching.manage'));

create policy "notification_preferences_self" on public.notification_preferences
for select using (user_id = auth.uid() or public.has_permission('notifications.manage'));
create policy "notification_preferences_upsert_self" on public.notification_preferences
for all using (user_id = auth.uid() or public.has_permission('notifications.manage'))
with check (user_id = auth.uid() or public.has_permission('notifications.manage'));

create policy "notification_deliveries_staff" on public.notification_deliveries
for select using (public.has_permission('notifications.manage'));
create policy "notification_deliveries_manage_staff" on public.notification_deliveries
for all using (public.has_permission('notifications.manage'))
with check (public.has_permission('notifications.manage'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('assignment-submissions', 'assignment-submissions', false, 52428800, array['application/pdf','image/png','image/jpeg','image/webp','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "assignment_submissions_storage_read" on storage.objects
for select using (
  bucket_id = 'assignment-submissions'
  and (
    public.has_permission('academic.manage')
    or public.has_permission('teaching.manage')
    or exists (
      select 1
      from public.submission_files sf
      join public.assignment_submissions s on s.id = sf.submission_id
      join public.student_profiles sp on sp.id = s.student_id
      where sf.storage_path = storage.objects.name
        and sp.user_id = auth.uid()
    )
  )
);

create policy "assignment_submissions_storage_upload" on storage.objects
for insert with check (
  bucket_id = 'assignment-submissions'
  and lower(name) !~ '\.(exe|bat|cmd|msi|dll|ps1|sh|php|js|jar)$'
  and public.has_role('student')
);
