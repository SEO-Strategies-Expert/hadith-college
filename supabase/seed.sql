insert into public.permissions (slug, name_ar, description_ar)
values
  ('admin.access', 'دخول الإدارة', 'الوصول إلى لوحة الإدارة'),
  ('users.manage', 'إدارة المستخدمين', 'إدارة الأدوار والصلاحيات والدعوات'),
  ('content.manage', 'إدارة المحتوى', 'إدارة صفحات الموقع والملاحة والإعدادات العامة'),
  ('content.publish', 'نشر المحتوى', 'نشر الصفحات والأقسام'),
  ('contact.read', 'قراءة رسائل التواصل', 'استعراض رسائل التواصل'),
  ('contact.manage', 'إدارة رسائل التواصل', 'تحديث حالة رسائل التواصل'),
  ('audit.read', 'قراءة سجل العمليات', 'عرض سجل العمليات الحساسة')
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  description_ar = excluded.description_ar,
  updated_at = now();

insert into public.roles (slug, name_ar, description_ar)
values
  ('super_admin', 'المدير الأعلى', 'كل الصلاحيات'),
  ('college_admin', 'مدير الكلية', 'إدارة معظم النظام دون الأسرار'),
  ('academic_admin', 'المدير الأكاديمي', 'إدارة البرامج والمقررات'),
  ('content_editor', 'محرر المحتوى', 'إدارة صفحات الموقع والمحتوى العام'),
  ('admissions_officer', 'موظف القبول', 'إدارة طلبات القبول'),
  ('finance_officer', 'موظف المالية', 'إدارة الرسوم فقط'),
  ('librarian', 'أمين المكتبة', 'إدارة المكتبة والمواقع الحديثية'),
  ('instructor', 'مدرس', 'إدارة مقرراته ودروسه'),
  ('teaching_assistant', 'مساعد تدريس', 'مساعدة المدرس في الشعب المسندة'),
  ('reviewer', 'مراجع', 'مراجعة علمية محددة'),
  ('student', 'طالب', 'الوصول إلى بياناته ومقرراته فقط')
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  description_ar = excluded.description_ar,
  updated_at = now();

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug = 'super_admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('admin.access', 'users.manage', 'content.manage', 'content.publish', 'contact.read', 'contact.manage', 'audit.read')
where r.slug = 'college_admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.slug in ('admin.access', 'content.manage', 'content.publish', 'contact.read')
where r.slug in ('content_editor', 'librarian')
on conflict do nothing;

insert into public.site_settings (key, value_json, is_public, is_demo)
values
  ('identity', '{"name_ar":"كلية الحديث وعلومه","accreditation_ar":"جامعة أبو بكر إبراهيم","tagline_ar":"للرواية والدراية والتحقيق","logo_path":"/assets/img/logo-official.png"}', true, true),
  ('fees_message', '{"text_ar":"الدفع للقادر إسهام في الأجر، ويساعد الكلية على حمل طلاب آخرين لا يستطيعون تحمّل الرسوم."}', true, true)
on conflict (key) do update set
  value_json = excluded.value_json,
  is_public = excluded.is_public,
  is_demo = excluded.is_demo,
  updated_at = now();

insert into public.pages (slug, title_ar, excerpt_ar, status, template, published_at, seo_title_ar, seo_description_ar, is_demo)
values
  ('home', 'كلية الحديث وعلومه', 'منصة عربية متخصصة في علوم الحديث رواية ودراية، والتخريج، والتحقيق، وعلوم المخطوطات.', 'published', 'home', now(), 'كلية الحديث وعلومه', 'منصة عربية متخصصة في علوم الحديث والرواية والدراية والتحقيق.', true),
  ('about', 'عن الكلية', 'كلية تدريسية بحثية متخصصة في علوم الحديث رواية ودراية.', 'published', 'standard', now(), 'عن كلية الحديث وعلومه', 'تعرف إلى الرؤية والرسالة والقيم.', true),
  ('programs', 'البرامج الأكاديمية', 'برامج متدرجة في علوم الحديث والتخريج والتحقيق.', 'published', 'programs', now(), 'البرامج الأكاديمية', 'برامج كلية الحديث وعلومه.', true),
  ('admissions', 'القبول والتسجيل', 'طلب التحاق أولي مع نظام رسوم مرن.', 'published', 'standard', now(), 'القبول والتسجيل', 'قدّم طلب الالتحاق بكلية الحديث وعلومه.', true),
  ('research-sites', 'المواقع الحديثية البحثية', 'دليل مصادر بحثية خارجية مجانية مختارة.', 'published', 'research_sites', now(), 'المواقع الحديثية البحثية', 'دليل مصادر بحثية حديثية مختارة.', true)
on conflict (slug) do update set
  title_ar = excluded.title_ar,
  excerpt_ar = excluded.excerpt_ar,
  status = excluded.status,
  template = excluded.template,
  published_at = excluded.published_at,
  seo_title_ar = excluded.seo_title_ar,
  seo_description_ar = excluded.seo_description_ar,
  is_demo = excluded.is_demo,
  updated_at = now();

insert into public.page_sections (page_id, section_type, heading_ar, content_json, sort_order, is_visible, status, is_demo)
select p.id, 'hero', 'كلية الحديث وعلومه',
  '{"eyebrow_ar":"جامعة أبو بكر إبراهيم","title_ar":"كلية الحديث وعلومه","lead_ar":"منصة عربية متخصصة في الرواية والدراية والتحقيق، تنتقل الآن إلى منصة قابلة للإدارة.","primary_cta_ar":"قدّم الآن","primary_href":"/admissions","secondary_cta_ar":"استعرض البرامج","secondary_href":"/programs"}',
  0, true, 'published', true
from public.pages p
where p.slug = 'home'
on conflict do nothing;

insert into public.navigation_items (location, label_ar, href, sort_order, is_visible, is_demo)
values
  ('header', 'الرئيسية', '/', 0, true, true),
  ('header', 'عن الكلية', '/about', 10, true, true),
  ('header', 'البرامج', '/programs', 20, true, true),
  ('header', 'القبول', '/admissions', 30, true, true),
  ('header', 'المواقع الحديثية', '/research-sites', 40, true, true),
  ('header', 'دخول الطالب', '/dashboard/student', 50, true, true)
on conflict do nothing;
