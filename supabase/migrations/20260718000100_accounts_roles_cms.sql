create extension if not exists pgcrypto;

create type public.user_status as enum ('active', 'invited', 'suspended', 'archived');
create type public.content_status as enum ('draft', 'pending_review', 'published', 'archived');
create type public.navigation_location as enum ('header', 'footer', 'dashboard');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name_ar text,
  full_name_en text,
  avatar_url text,
  status public.user_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  description_ar text,
  is_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger roles_set_updated_at
before update on public.roles
for each row execute function public.set_updated_at();

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  description_ar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger permissions_set_updated_at
before update on public.permissions
for each row execute function public.set_updated_at();

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create table public.user_roles (
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  primary key (user_id, role_id)
);

create index user_roles_role_id_idx on public.user_roles(role_id);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function public.has_role(role_slug text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    join public.profiles p on p.id = ur.user_id
    where ur.user_id = target_user_id
      and r.slug = role_slug
      and p.status = 'active'
      and p.deleted_at is null
  );
$$;

create or replace function public.has_permission(permission_slug text, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    join public.profiles prof on prof.id = ur.user_id
    where ur.user_id = target_user_id
      and p.slug = permission_slug
      and prof.status = 'active'
      and prof.deleted_at is null
  )
  or public.has_role('super_admin', target_user_id);
$$;

create or replace function public.is_admin(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('super_admin', target_user_id)
    or public.has_role('college_admin', target_user_id)
    or public.has_permission('admin.access', target_user_id);
$$;

create or replace function public.owns_record(record_user_id uuid)
returns boolean
language sql
stable
as $$
  select auth.uid() = record_user_id;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name_ar, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name_ar', new.raw_user_meta_data ->> 'name'),
    'active'
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_json jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create table public.media_files (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  alt_ar text,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  access_level text not null default 'public',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz,
  unique (bucket, path)
);

create trigger media_files_set_updated_at
before update on public.media_files
for each row execute function public.set_updated_at();

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text,
  excerpt_ar text,
  excerpt_en text,
  status public.content_status not null default 'draft',
  template text not null default 'standard',
  featured_image_id uuid references public.media_files(id),
  published_at timestamptz,
  seo_title_ar text,
  seo_description_ar text,
  is_demo boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index pages_status_idx on public.pages(status);
create index pages_published_at_idx on public.pages(published_at desc);

create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_type text not null,
  heading_ar text,
  heading_en text,
  content_json jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  status public.content_status not null default 'draft',
  is_demo boolean not null default false,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint page_sections_sort_nonnegative check (sort_order >= 0)
);

create index page_sections_page_id_idx on public.page_sections(page_id);
create index page_sections_status_idx on public.page_sections(status);

create trigger page_sections_set_updated_at
before update on public.page_sections
for each row execute function public.set_updated_at();

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('page', 'page_section', 'site_setting')),
  entity_id uuid not null,
  revision_number integer not null,
  snapshot_json jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (entity_type, entity_id, revision_number)
);

create table public.seo_metadata (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null unique references public.pages(id) on delete cascade,
  title_ar text,
  description_ar text,
  canonical_url text,
  og_image_id uuid references public.media_files(id),
  json_ld jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id)
);

create trigger seo_metadata_set_updated_at
before update on public.seo_metadata
for each row execute function public.set_updated_at();

create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.navigation_items(id) on delete cascade,
  location public.navigation_location not null default 'header',
  label_ar text not null,
  href text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  required_permission text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  constraint navigation_items_sort_nonnegative check (sort_order >= 0)
);

create index navigation_items_location_idx on public.navigation_items(location, sort_order);

create trigger navigation_items_set_updated_at
before update on public.navigation_items
for each row execute function public.set_updated_at();

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references public.pages(id) on delete cascade,
  question_ar text not null,
  answer_ar text not null,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  deleted_at timestamptz
);

create trigger faqs_set_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  department text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed', 'spam')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  assigned_to uuid references public.profiles(id),
  deleted_at timestamptz
);

create trigger contact_messages_set_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_logs enable row level security;
alter table public.site_settings enable row level security;
alter table public.media_files enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.content_revisions enable row level security;
alter table public.seo_metadata enable row level security;
alter table public.navigation_items enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_messages enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles
for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

create policy "roles_select_authenticated" on public.roles
for select to authenticated using (true);

create policy "roles_manage_admin" on public.roles
for all using (public.has_permission('users.manage'))
with check (public.has_permission('users.manage'));

create policy "permissions_select_authenticated" on public.permissions
for select to authenticated using (true);

create policy "permissions_manage_admin" on public.permissions
for all using (public.has_permission('users.manage'))
with check (public.has_permission('users.manage'));

create policy "role_permissions_select_authenticated" on public.role_permissions
for select to authenticated using (true);

create policy "role_permissions_manage_admin" on public.role_permissions
for all using (public.has_permission('users.manage'))
with check (public.has_permission('users.manage'));

create policy "user_roles_select_self_or_admin" on public.user_roles
for select using (user_id = auth.uid() or public.has_permission('users.manage'));

create policy "user_roles_manage_admin" on public.user_roles
for all using (public.has_permission('users.manage'))
with check (public.has_permission('users.manage'));

create policy "audit_logs_select_authorized" on public.audit_logs
for select using (public.has_permission('audit.read'));

create policy "audit_logs_insert_authenticated" on public.audit_logs
for insert to authenticated with check (actor_id = auth.uid() or public.is_admin());

create policy "site_settings_public_read" on public.site_settings
for select using (is_public = true or public.has_permission('content.manage'));

create policy "site_settings_manage_content" on public.site_settings
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "media_files_public_read" on public.media_files
for select using ((access_level = 'public' and deleted_at is null) or public.has_permission('content.manage'));

create policy "media_files_manage_content" on public.media_files
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "pages_public_read_published" on public.pages
for select using ((status = 'published' and deleted_at is null) or public.has_permission('content.manage'));

create policy "pages_manage_content" on public.pages
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "page_sections_public_read_published" on public.page_sections
for select using (
  (
    status = 'published'
    and is_visible = true
    and deleted_at is null
    and exists (
      select 1 from public.pages p
      where p.id = page_sections.page_id
        and p.status = 'published'
        and p.deleted_at is null
    )
  )
  or public.has_permission('content.manage')
);

create policy "page_sections_manage_content" on public.page_sections
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "content_revisions_select_content_admin" on public.content_revisions
for select using (public.has_permission('content.manage'));

create policy "content_revisions_insert_content_admin" on public.content_revisions
for insert with check (public.has_permission('content.manage'));

create policy "seo_metadata_public_read_published" on public.seo_metadata
for select using (
  exists (
    select 1 from public.pages p
    where p.id = seo_metadata.page_id
      and p.status = 'published'
      and p.deleted_at is null
  )
  or public.has_permission('content.manage')
);

create policy "seo_metadata_manage_content" on public.seo_metadata
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "navigation_items_public_read" on public.navigation_items
for select using ((is_visible = true and required_permission is null) or public.has_permission('content.manage'));

create policy "navigation_items_manage_content" on public.navigation_items
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "faqs_public_read_published" on public.faqs
for select using ((status = 'published' and deleted_at is null) or public.has_permission('content.manage'));

create policy "faqs_manage_content" on public.faqs
for all using (public.has_permission('content.manage'))
with check (public.has_permission('content.manage'));

create policy "contact_messages_insert_public" on public.contact_messages
for insert with check (true);

create policy "contact_messages_select_authorized" on public.contact_messages
for select using (public.has_permission('contact.read'));

create policy "contact_messages_update_authorized" on public.contact_messages
for update using (public.has_permission('contact.manage'))
with check (public.has_permission('contact.manage'));
