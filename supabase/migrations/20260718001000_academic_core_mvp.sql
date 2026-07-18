do $$
begin
  create type public.academic_record_status as enum ('draft', 'pending_review', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.student_academic_status as enum ('applicant', 'accepted', 'active', 'suspended', 'withdrawn', 'graduated', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.enrollment_status as enum ('active', 'withdrawn', 'completed', 'failed', 'archived');
exception when duplicate_object then null;
end $$;

insert into public.permissions (slug, name_ar, description_ar)
values
  ('academic.manage', 'إدارة الشؤون الأكاديمية', 'إدارة البرامج والمقررات والفصول والشعب'),
  ('faculty.manage', 'إدارة هيئة التدريس', 'إدارة ملفات المدرسين وإسناد الشعب'),
  ('students.manage', 'إدارة الطلاب', 'إدارة ملفات الطلاب والتسجيلات الأكاديمية'),
  ('courses.teach', 'إدارة مقررات المدرس', 'إدارة الوحدات والدروس داخل الشعب المسندة'),
  ('storage.manage', 'إدارة الملفات', 'رفع وتنظيم ملفات المنصة')
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
join public.permissions p on p.slug in (
  'admin.access',
  'academic.manage',
  'faculty.manage',
  'students.manage',
  'courses.teach',
  'storage.manage',
  'audit.read'
)
where r.slug in ('college_admin', 'academic_admin')
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('admin.access', 'students.manage', 'audit.read')
where r.slug = 'admissions_officer'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('courses.teach')
where r.slug in ('instructor', 'teaching_assistant')
on conflict do nothing;

alter table public.profiles
  add column if not exists phone text,
  add column if not exists last_seen_at timestamptz;

create table if not exists public.faculty_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name_ar text not null,
  full_name_en text,
  slug text not null unique,
  academic_title text,
  specialization text,
  degree text,
  university text,
  bio_short text,
  bio_full text,
  experience text,
  ijazat_summary text,
  research text,
  languages text[] not null default '{}',
  public_email text,
  office_hours text,
  profile_image text,
  cv_file text,
  is_featured boolean not null default false,
  status public.academic_record_status not null default 'draft',
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint faculty_profiles_sort_nonnegative check (sort_order >= 0)
);

create trigger faculty_profiles_set_updated_at
before update on public.faculty_profiles
for each row execute function public.set_updated_at();

create table if not exists public.academic_programs (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text,
  slug text not null unique,
  short_description text,
  full_description text,
  program_type text,
  qualification_type text,
  duration_text text,
  duration_months integer,
  number_of_levels integer,
  credit_hours integer,
  study_language text,
  study_mode text,
  target_audience text,
  admission_requirements text,
  learning_outcomes text,
  certificate_type text,
  registration_open_at timestamptz,
  registration_close_at timestamptz,
  study_start_at timestamptz,
  study_end_at timestamptz,
  capacity integer,
  status public.academic_record_status not null default 'draft',
  featured_image text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint academic_programs_duration_nonnegative check (duration_months is null or duration_months >= 0),
  constraint academic_programs_levels_positive check (number_of_levels is null or number_of_levels > 0),
  constraint academic_programs_capacity_nonnegative check (capacity is null or capacity >= 0)
);

create index if not exists academic_programs_status_idx on public.academic_programs(status, sort_order);

create trigger academic_programs_set_updated_at
before update on public.academic_programs
for each row execute function public.set_updated_at();

create table if not exists public.program_levels (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.academic_programs(id) on delete cascade,
  level_number integer not null,
  name_ar text not null,
  name_en text,
  description text,
  sort_order integer not null default 0,
  status public.academic_record_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, level_number)
);

create trigger program_levels_set_updated_at
before update on public.program_levels
for each row execute function public.set_updated_at();

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name_ar text not null,
  name_en text,
  slug text not null unique,
  description text,
  objectives text,
  credit_hours integer not null default 0,
  study_hours integer,
  course_type text,
  level_id uuid references public.program_levels(id) on delete set null,
  status public.academic_record_status not null default 'draft',
  passing_grade numeric(5,2) not null default 60,
  attendance_requirement numeric(5,2) not null default 75,
  featured_image text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint courses_hours_nonnegative check (credit_hours >= 0 and (study_hours is null or study_hours >= 0))
);

create index if not exists courses_status_idx on public.courses(status);

create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create table if not exists public.course_learning_outcomes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  outcome_ar text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.course_prerequisites (
  course_id uuid not null references public.courses(id) on delete cascade,
  prerequisite_course_id uuid not null references public.courses(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (course_id, prerequisite_course_id),
  constraint course_prerequisites_not_self check (course_id <> prerequisite_course_id)
);

create table if not exists public.program_courses (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.academic_programs(id) on delete cascade,
  level_id uuid references public.program_levels(id) on delete set null,
  course_id uuid not null references public.courses(id) on delete cascade,
  sort_order integer not null default 0,
  is_required boolean not null default true,
  created_at timestamptz not null default now(),
  unique (program_id, course_id)
);

create table if not exists public.academic_terms (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  slug text not null unique,
  starts_at date not null,
  ends_at date not null,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  status public.academic_record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint academic_terms_date_order check (ends_at >= starts_at)
);

create trigger academic_terms_set_updated_at
before update on public.academic_terms
for each row execute function public.set_updated_at();

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  student_number text not null unique,
  full_name_ar text not null,
  full_name_en text,
  email text not null,
  phone text,
  nationality text,
  country text,
  date_of_birth date,
  qualification text,
  admission_status text not null default 'applicant',
  academic_status public.student_academic_status not null default 'applicant',
  fee_status text not null default 'pending',
  program_id uuid references public.academic_programs(id) on delete set null,
  current_level_id uuid references public.program_levels(id) on delete set null,
  joined_at date,
  graduated_at date,
  notes text,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists student_profiles_user_id_idx on public.student_profiles(user_id);
create index if not exists student_profiles_status_idx on public.student_profiles(academic_status, admission_status);

create trigger student_profiles_set_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.academic_programs(id) on delete cascade,
  term_id uuid references public.academic_terms(id) on delete set null,
  name_ar text not null,
  slug text not null unique,
  capacity integer,
  status public.academic_record_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cohorts_capacity_nonnegative check (capacity is null or capacity >= 0)
);

create trigger cohorts_set_updated_at
before update on public.cohorts
for each row execute function public.set_updated_at();

create table if not exists public.course_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  term_id uuid not null references public.academic_terms(id) on delete cascade,
  cohort_id uuid references public.cohorts(id) on delete set null,
  section_code text not null,
  capacity integer not null default 30,
  starts_at timestamptz,
  ends_at timestamptz,
  status public.academic_record_status not null default 'draft',
  meeting_mode text not null default 'online',
  timezone text not null default 'Asia/Qatar',
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, term_id, section_code),
  constraint course_sections_capacity_positive check (capacity > 0)
);

create trigger course_sections_set_updated_at
before update on public.course_sections
for each row execute function public.set_updated_at();

create table if not exists public.course_instructors (
  section_id uuid not null references public.course_sections(id) on delete cascade,
  faculty_id uuid not null references public.faculty_profiles(id) on delete cascade,
  role text not null default 'instructor',
  created_at timestamptz not null default now(),
  primary key (section_id, faculty_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.course_sections(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  status public.enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  created_by uuid references public.profiles(id),
  unique (section_id, student_id)
);

create index if not exists enrollments_student_id_idx on public.enrollments(student_id, status);
create index if not exists enrollments_section_id_idx on public.enrollments(section_id, status);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  section_id uuid references public.course_sections(id) on delete cascade,
  title_ar text not null,
  description text,
  sort_order integer not null default 0,
  status public.academic_record_status not null default 'draft',
  available_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger course_modules_set_updated_at
before update on public.course_modules
for each row execute function public.set_updated_at();

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title_ar text not null,
  content_text text,
  video_url text,
  audio_url text,
  pdf_url text,
  external_url text,
  references_text text,
  sort_order integer not null default 0,
  status public.academic_record_status not null default 'draft',
  available_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

create table if not exists public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  resource_type text not null check (resource_type in ('text', 'video', 'audio', 'pdf', 'link', 'reference')),
  title_ar text not null,
  url text,
  storage_path text,
  mime_type text,
  size_bytes bigint,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint lesson_resources_size_nonnegative check (size_bytes is null or size_bytes >= 0)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  started_at timestamptz,
  completed_at timestamptz,
  progress_percentage integer not null default 0,
  last_position text,
  is_completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id),
  constraint lesson_progress_percentage_range check (progress_percentage between 0 and 100)
);

create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

create or replace function public.is_section_instructor(target_section_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_instructors ci
    join public.faculty_profiles fp on fp.id = ci.faculty_id
    join public.profiles p on p.id = fp.user_id
    where ci.section_id = target_section_id
      and fp.user_id = target_user_id
      and p.status = 'active'
      and p.deleted_at is null
  );
$$;

create or replace function public.is_course_instructor(target_course_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.course_sections cs
    where cs.course_id = target_course_id
      and public.is_section_instructor(cs.id, target_user_id)
  );
$$;

create or replace function public.is_student_enrolled(target_section_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.student_profiles sp on sp.id = e.student_id
    join public.profiles p on p.id = sp.user_id
    where e.section_id = target_section_id
      and sp.user_id = target_user_id
      and e.status = 'active'
      and p.status = 'active'
      and p.deleted_at is null
  );
$$;

create or replace function public.can_access_lesson(target_lesson_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.lessons l
    join public.course_modules cm on cm.id = l.module_id
    join public.course_sections cs on cs.id = cm.section_id
    where l.id = target_lesson_id
      and l.status = 'published'
      and cm.status = 'published'
      and (
        public.is_student_enrolled(cs.id, target_user_id)
        or public.is_section_instructor(cs.id, target_user_id)
        or public.has_permission('academic.manage', target_user_id)
      )
  );
$$;

create or replace function public.enforce_section_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_count integer;
  max_capacity integer;
begin
  if new.status <> 'active' then
    return new;
  end if;

  select capacity into max_capacity
  from public.course_sections
  where id = new.section_id;

  select count(*) into active_count
  from public.enrollments
  where section_id = new.section_id
    and status = 'active'
    and (tg_op = 'INSERT' or id <> new.id);

  if active_count >= max_capacity then
    raise exception 'course section capacity reached';
  end if;

  return new;
end;
$$;

create trigger enrollments_enforce_capacity
before insert or update of status, section_id on public.enrollments
for each row execute function public.enforce_section_capacity();

create or replace function public.audit_profile_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, old_values, new_values)
    values (auth.uid(), 'profile.status.update', 'profile', new.id, jsonb_build_object('status', old.status), jsonb_build_object('status', new.status));
  end if;
  return new;
end;
$$;

create trigger profiles_audit_status_change
after update of status on public.profiles
for each row execute function public.audit_profile_status_change();

create or replace function public.audit_user_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (actor_id, action, entity_type, entity_id, new_values)
    values (auth.uid(), 'user_role.assign', 'user_role', new.user_id, to_jsonb(new));
    return new;
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, old_values)
  values (auth.uid(), 'user_role.remove', 'user_role', old.user_id, to_jsonb(old));
  return old;
end;
$$;

create trigger user_roles_audit_insert
after insert on public.user_roles
for each row execute function public.audit_user_role_change();

create trigger user_roles_audit_delete
after delete on public.user_roles
for each row execute function public.audit_user_role_change();

alter table public.faculty_profiles enable row level security;
alter table public.academic_programs enable row level security;
alter table public.program_levels enable row level security;
alter table public.courses enable row level security;
alter table public.course_learning_outcomes enable row level security;
alter table public.course_prerequisites enable row level security;
alter table public.program_courses enable row level security;
alter table public.academic_terms enable row level security;
alter table public.student_profiles enable row level security;
alter table public.cohorts enable row level security;
alter table public.course_sections enable row level security;
alter table public.course_instructors enable row level security;
alter table public.enrollments enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.lesson_progress enable row level security;

create policy "faculty_public_read_published" on public.faculty_profiles
for select using ((status = 'published' and deleted_at is null) or user_id = auth.uid() or public.has_permission('faculty.manage'));
create policy "faculty_manage_admin" on public.faculty_profiles
for all using (public.has_permission('faculty.manage'))
with check (public.has_permission('faculty.manage'));

create policy "programs_public_read_published" on public.academic_programs
for select using ((status = 'published' and deleted_at is null) or public.has_permission('academic.manage'));
create policy "programs_manage_academic" on public.academic_programs
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "levels_public_read_published_programs" on public.program_levels
for select using (
  exists (
    select 1 from public.academic_programs ap
    where ap.id = program_levels.program_id
      and ap.status = 'published'
      and ap.deleted_at is null
  )
  or public.has_permission('academic.manage')
);
create policy "levels_manage_academic" on public.program_levels
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "courses_public_read_published" on public.courses
for select using ((status = 'published' and deleted_at is null) or public.has_permission('academic.manage') or public.is_course_instructor(id));
create policy "courses_manage_academic" on public.courses
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "outcomes_read_with_course" on public.course_learning_outcomes
for select using (exists (select 1 from public.courses c where c.id = course_learning_outcomes.course_id and (c.status = 'published' or public.has_permission('academic.manage') or public.is_course_instructor(c.id))));
create policy "outcomes_manage_academic" on public.course_learning_outcomes
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "prerequisites_read_with_course" on public.course_prerequisites
for select using (exists (select 1 from public.courses c where c.id = course_prerequisites.course_id and (c.status = 'published' or public.has_permission('academic.manage') or public.is_course_instructor(c.id))));
create policy "prerequisites_manage_academic" on public.course_prerequisites
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "program_courses_read_published" on public.program_courses
for select using (
  exists (
    select 1 from public.academic_programs ap
    where ap.id = program_courses.program_id
      and ap.status = 'published'
      and ap.deleted_at is null
  )
  or public.has_permission('academic.manage')
);
create policy "program_courses_manage_academic" on public.program_courses
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "terms_select_authenticated" on public.academic_terms
for select to authenticated using (true);
create policy "terms_manage_academic" on public.academic_terms
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "students_select_self_or_admin" on public.student_profiles
for select using (user_id = auth.uid() or public.has_permission('students.manage'));
create policy "students_manage_admin" on public.student_profiles
for all using (public.has_permission('students.manage'))
with check (public.has_permission('students.manage'));

create policy "cohorts_select_academic" on public.cohorts
for select using (public.has_permission('academic.manage') or public.has_permission('students.manage'));
create policy "cohorts_manage_academic" on public.cohorts
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "sections_select_authorized" on public.course_sections
for select using (
  public.has_permission('academic.manage')
  or public.is_section_instructor(id)
  or public.is_student_enrolled(id)
);
create policy "sections_manage_academic" on public.course_sections
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "section_instructors_select_authorized" on public.course_instructors
for select using (
  public.has_permission('academic.manage')
  or public.is_section_instructor(section_id)
  or exists (select 1 from public.course_sections cs where cs.id = course_instructors.section_id and public.is_student_enrolled(cs.id))
);
create policy "section_instructors_manage_academic" on public.course_instructors
for all using (public.has_permission('academic.manage'))
with check (public.has_permission('academic.manage'));

create policy "enrollments_select_self_instructor_or_admin" on public.enrollments
for select using (
  public.has_permission('students.manage')
  or public.is_section_instructor(section_id)
  or exists (
    select 1 from public.student_profiles sp
    where sp.id = enrollments.student_id
      and sp.user_id = auth.uid()
  )
);
create policy "enrollments_manage_admin" on public.enrollments
for all using (public.has_permission('students.manage') or public.has_permission('academic.manage'))
with check (public.has_permission('students.manage') or public.has_permission('academic.manage'));

create policy "modules_select_authorized" on public.course_modules
for select using (
  public.has_permission('academic.manage')
  or (section_id is not null and (public.is_section_instructor(section_id) or public.is_student_enrolled(section_id)))
);
create policy "modules_manage_instructor" on public.course_modules
for all using (
  public.has_permission('academic.manage')
  or (section_id is not null and public.is_section_instructor(section_id) and public.has_permission('courses.teach'))
)
with check (
  public.has_permission('academic.manage')
  or (section_id is not null and public.is_section_instructor(section_id) and public.has_permission('courses.teach'))
);

create policy "lessons_select_authorized" on public.lessons
for select using (
  public.has_permission('academic.manage')
  or exists (
    select 1
    from public.course_modules cm
    where cm.id = lessons.module_id
      and (
        public.is_section_instructor(cm.section_id)
        or (lessons.status = 'published' and cm.status = 'published' and public.is_student_enrolled(cm.section_id))
      )
  )
);
create policy "lessons_manage_instructor" on public.lessons
for all using (
  public.has_permission('academic.manage')
  or exists (
    select 1 from public.course_modules cm
    where cm.id = lessons.module_id
      and public.is_section_instructor(cm.section_id)
      and public.has_permission('courses.teach')
  )
)
with check (
  public.has_permission('academic.manage')
  or exists (
    select 1 from public.course_modules cm
    where cm.id = lessons.module_id
      and public.is_section_instructor(cm.section_id)
      and public.has_permission('courses.teach')
  )
);

create policy "resources_select_authorized" on public.lesson_resources
for select using (public.can_access_lesson(lesson_id) or public.has_permission('academic.manage'));
create policy "resources_manage_instructor" on public.lesson_resources
for all using (
  public.has_permission('academic.manage')
  or exists (
    select 1 from public.lessons l
    join public.course_modules cm on cm.id = l.module_id
    where l.id = lesson_resources.lesson_id
      and public.is_section_instructor(cm.section_id)
      and public.has_permission('courses.teach')
  )
)
with check (
  public.has_permission('academic.manage')
  or exists (
    select 1 from public.lessons l
    join public.course_modules cm on cm.id = l.module_id
    where l.id = lesson_resources.lesson_id
      and public.is_section_instructor(cm.section_id)
      and public.has_permission('courses.teach')
  )
);

create policy "progress_select_self_or_admin" on public.lesson_progress
for select using (
  public.has_permission('students.manage')
  or exists (select 1 from public.student_profiles sp where sp.id = lesson_progress.student_id and sp.user_id = auth.uid())
);
create policy "progress_upsert_self" on public.lesson_progress
for insert with check (
  exists (select 1 from public.student_profiles sp where sp.id = lesson_progress.student_id and sp.user_id = auth.uid())
  and public.can_access_lesson(lesson_id)
);
create policy "progress_update_self" on public.lesson_progress
for update using (
  exists (select 1 from public.student_profiles sp where sp.id = lesson_progress.student_id and sp.user_id = auth.uid())
)
with check (
  exists (select 1 from public.student_profiles sp where sp.id = lesson_progress.student_id and sp.user_id = auth.uid())
  and public.can_access_lesson(lesson_id)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-assets', 'public-assets', true, 10485760, array['image/png','image/jpeg','image/webp','application/pdf']),
  ('faculty-avatars', 'faculty-avatars', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('course-materials', 'course-materials', false, 52428800, array['application/pdf','image/png','image/jpeg','image/webp','audio/mpeg','video/mp4','text/plain'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public_assets_read" on storage.objects
for select using (bucket_id = 'public-assets');
create policy "faculty_avatars_public_read" on storage.objects
for select using (bucket_id = 'faculty-avatars');
create policy "course_materials_authenticated_read" on storage.objects
for select using (
  bucket_id = 'course-materials'
  and (
    public.has_permission('academic.manage')
    or public.has_permission('courses.teach')
    or exists (
      select 1
      from public.lesson_resources lr
      join public.lessons l on l.id = lr.lesson_id
      where lr.storage_path = storage.objects.name
        and public.can_access_lesson(l.id)
    )
  )
);
create policy "managed_uploads" on storage.objects
for insert with check (
  bucket_id in ('public-assets', 'faculty-avatars', 'course-materials')
  and (public.has_permission('storage.manage') or public.has_permission('academic.manage') or public.has_permission('courses.teach'))
  and lower(name) !~ '\.(exe|bat|cmd|msi|dll|ps1|sh|php|js|jar)$'
);
