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

insert into public.academic_programs (
  name_ar,
  name_en,
  slug,
  short_description,
  full_description,
  program_type,
  qualification_type,
  duration_text,
  duration_months,
  number_of_levels,
  credit_hours,
  study_language,
  study_mode,
  target_audience,
  admission_requirements,
  learning_outcomes,
  certificate_type,
  capacity,
  status,
  is_featured,
  sort_order,
  seo_title,
  seo_description,
  is_demo
)
values
  ('الدبلوم التأسيسي في علوم الحديث', 'Foundation Diploma in Hadith Sciences', 'foundation', 'مدخل متدرج إلى علوم الحديث ومناهج المحدثين ومصادر السنة.', 'برنامج تأسيسي يبني لغة الطالب الحديثية ويمهده لدراسة المصطلح والتخريج والرواية والدراية.', 'diploma', 'foundation_diploma', 'عام دراسي', 12, 2, 24, 'العربية', 'online', 'المبتدئون وطلاب العلم الراغبون في تأسيس منهجي.', 'معرفة أولية بالعربية والالتزام بخطة الدراسة.', 'فهم مصطلحات الحديث الأساسية، قراءة المصادر، وبناء تصور أولي لمناهج المحدثين.', 'شهادة دبلوم تأسيسي', 120, 'published', true, 10, 'الدبلوم التأسيسي في علوم الحديث', 'برنامج تأسيسي في علوم الحديث ومصادر السنة.', true),
  ('التخريج ودراسة الأسانيد', 'Takhrij and Isnad Studies', 'takhrij', 'تطبيق عملي على جمع الطرق، دراسة الرواة، وبناء نتيجة معللة.', 'مسار تطبيقي يدرّب الطالب على التخريج العملي ودراسة الأسانيد وتحرير الحكم الحديثي.', 'track', 'certificate', 'مسار تطبيقي', 6, 1, 12, 'العربية', 'online', 'طلاب العلم والباحثون في السنة.', 'إتمام التأسيس أو معرفة مناسبة بمصطلح الحديث.', 'جمع الطرق، تحليل الأسانيد، تحرير التخريج، وصياغة نتيجة علمية.', 'شهادة مسار تطبيقي', 80, 'published', true, 20, 'التخريج ودراسة الأسانيد', 'مسار تطبيقي في التخريج ودراسة الأسانيد.', true),
  ('التحقيق وعلوم المخطوطات', 'Manuscript Editing and Codicology', 'manuscripts', 'قراءة النسخ، المقابلة، ضبط الفروق، والتوثيق العلمي للنص.', 'مسار بحثي يعرّف الطالب بأصول التعامل مع النسخ الخطية وتحقيق النصوص الحديثية.', 'track', 'certificate', 'مسار بحثي', 6, 1, 12, 'العربية', 'online', 'الباحثون والمحققون وطلاب الدراسات العليا.', 'معرفة أولية بمناهج التحقيق واللغة العربية.', 'قراءة النسخ، ضبط الفروق، بناء apparatus نقدي، وتوثيق النص.', 'شهادة مسار بحثي', 60, 'published', true, 30, 'التحقيق وعلوم المخطوطات', 'مسار في تحقيق النصوص وعلوم المخطوطات.', true),
  ('المسار العالي', 'Advanced Hadith Track', 'higher', 'حلقة بحث متقدمة تجمع الرواية والدراية والتحقيق بإشراف علمي.', 'مسار متقدم للمتمكنين يجمع البحث والتحرير والمناقشة العلمية المنتظمة.', 'advanced_track', 'advanced_certificate', 'متقدم', 12, 2, 24, 'العربية', 'hybrid', 'الطلاب المتقدمون والباحثون.', 'اجتياز مقابلة علمية أو ما يعادلها.', 'بناء بحث حديثي متقدم، مناقشة العلل، والتحقيق العلمي.', 'شهادة المسار العالي', 40, 'published', true, 40, 'المسار العالي في علوم الحديث', 'مسار متقدم في الرواية والدراية والتحقيق.', true),
  ('الإجازات العلمية', 'Scholarly Ijazat', 'ijazat', 'مسارات قراءة وضبط وإجازة علمية بإشراف متخصص.', 'برنامج يضبط مسارات الإجازة العلمية ويؤرشف القراءة والسماع والتحقق.', 'ijazah', 'ijazah', 'حسب المسار', null, 1, null, 'العربية', 'online', 'طلاب الإجازات والرواية.', 'تحديد المتن والمسار العلمي المطلوب.', 'ضبط القراءة، توثيق السماع، وإصدار سجل إجازة.', 'إجازة علمية', 100, 'published', false, 50, 'الإجازات العلمية', 'مسارات الإجازة العلمية في كلية الحديث.', true),
  ('الدورات القصيرة', 'Short Courses', 'short-courses', 'دورات قصيرة مركزة في مهارات حديثية وبحثية.', 'حزمة دورات قصيرة تخدم مهارات الطالب والباحث في التخريج والبحث والتحقيق.', 'short_course', 'attendance_certificate', 'قصير', 2, 1, null, 'العربية', 'online', 'عموم المهتمين وطلاب الكلية.', 'لا توجد متطلبات خاصة إلا ما يعلنه كل مقرر.', 'اكتساب مهارة مركزة قابلة للتطبيق الفوري.', 'شهادة حضور', 200, 'published', false, 60, 'الدورات القصيرة في علوم الحديث', 'دورات قصيرة حديثية وبحثية.', true)
on conflict (slug) do update set
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  program_type = excluded.program_type,
  qualification_type = excluded.qualification_type,
  duration_text = excluded.duration_text,
  duration_months = excluded.duration_months,
  number_of_levels = excluded.number_of_levels,
  credit_hours = excluded.credit_hours,
  study_language = excluded.study_language,
  study_mode = excluded.study_mode,
  target_audience = excluded.target_audience,
  admission_requirements = excluded.admission_requirements,
  learning_outcomes = excluded.learning_outcomes,
  certificate_type = excluded.certificate_type,
  capacity = excluded.capacity,
  status = excluded.status,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  is_demo = excluded.is_demo,
  updated_at = now();

insert into public.program_levels (program_id, level_number, name_ar, description, sort_order, status)
select ap.id, 1, 'المستوى الأول', 'مدخل البرنامج ومهاراته الأساسية.', 10, 'published'
from public.academic_programs ap
where ap.slug in ('foundation', 'takhrij', 'manuscripts', 'higher', 'ijazat', 'short-courses')
on conflict (program_id, level_number) do update set
  name_ar = excluded.name_ar,
  description = excluded.description,
  status = excluded.status,
  updated_at = now();

insert into public.program_levels (program_id, level_number, name_ar, description, sort_order, status)
select ap.id, 2, 'المستوى الثاني', 'تطبيقات متقدمة ومشروع ختامي.', 20, 'published'
from public.academic_programs ap
where ap.slug in ('foundation', 'higher')
on conflict (program_id, level_number) do update set
  name_ar = excluded.name_ar,
  description = excluded.description,
  status = excluded.status,
  updated_at = now();

insert into public.courses (code, name_ar, name_en, slug, description, objectives, credit_hours, study_hours, course_type, status, passing_grade, attendance_requirement, is_demo)
values
  ('HAD101', 'مدخل إلى علوم الحديث', 'Introduction to Hadith Sciences', 'intro-to-hadith', 'تعريف بمصادر السنة ومصطلحاتها ومناهج المحدثين.', 'تمييز المصطلحات الأساسية وفهم خارطة علوم الحديث.', 3, 36, 'core', 'published', 60, 75, true),
  ('HAD220', 'التخريج العملي', 'Practical Takhrij', 'practical-takhrij', 'تطبيقات عملية على جمع الطرق ودراسة الأسانيد.', 'تنفيذ مهمة تخريج كاملة وصياغة نتيجتها.', 4, 48, 'core', 'published', 65, 80, true),
  ('MAN210', 'تحقيق النصوص الحديثية', 'Hadith Manuscript Editing', 'hadith-manuscript-editing', 'أصول قراءة النسخ والمقابلة وتحرير النص.', 'إنجاز نموذج تحقيق علمي مضبوط.', 4, 48, 'core', 'published', 65, 80, true)
on conflict (slug) do update set
  code = excluded.code,
  name_ar = excluded.name_ar,
  name_en = excluded.name_en,
  description = excluded.description,
  objectives = excluded.objectives,
  credit_hours = excluded.credit_hours,
  study_hours = excluded.study_hours,
  course_type = excluded.course_type,
  status = excluded.status,
  passing_grade = excluded.passing_grade,
  attendance_requirement = excluded.attendance_requirement,
  is_demo = excluded.is_demo,
  updated_at = now();

insert into public.program_courses (program_id, level_id, course_id, sort_order, is_required)
select ap.id, pl.id, c.id,
  case c.slug when 'intro-to-hadith' then 10 when 'practical-takhrij' then 20 else 30 end,
  true
from public.academic_programs ap
join public.program_levels pl on pl.program_id = ap.id and pl.level_number = 1
join public.courses c on (
  (ap.slug = 'foundation' and c.slug = 'intro-to-hadith')
  or (ap.slug = 'takhrij' and c.slug = 'practical-takhrij')
  or (ap.slug = 'manuscripts' and c.slug = 'hadith-manuscript-editing')
)
on conflict (program_id, course_id) do update set
  level_id = excluded.level_id,
  sort_order = excluded.sort_order,
  is_required = excluded.is_required;
