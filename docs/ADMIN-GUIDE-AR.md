# دليل الإدارة

## المستخدمون

افتح `/dashboard/admin/users`.

- ابحث بالبريد أو الاسم.
- صف حسب الدور أو الحالة.
- ادع مستخدمًا بالبريد. النظام يستخدم Invite/Magic Link ولا ينشئ كلمة مرور ثابتة.
- عيّن دورًا أو أزله.
- غيّر الحالة إلى `suspended` لإيقاف دخول اللوحات، أو `active` لإعادة التفعيل.

## هيئة التدريس

افتح `/dashboard/admin/faculty`.

- أضف عضو هيئة تدريس.
- اربطه بحساب Auth موجود أو أدخل البريد لإرسال دعوة.
- أدخل مسارات الصورة وملف CV من Storage.
- غيّر الحالة إلى `published` لإظهار الملف العام.

## الطلاب

افتح `/dashboard/admin/students`.

- أضف طالبًا ورقمه الأكاديمي.
- اربطه ببرنامج ومستوى.
- أرسل دعوة حساب الطالب بالبريد عند الحاجة.
- استخدم البحث والتصفية وCSV export المبدئي.

## Academic Core

- البرامج: `/dashboard/admin/academic/programs`
- المقررات: `/dashboard/admin/academic/courses`
- الفصول: `/dashboard/admin/academic/terms`
- الدفعات: `/dashboard/admin/academic/cohorts`
- الشعب: `/dashboard/admin/academic/sections`
- التسجيلات: `/dashboard/admin/academic/enrollments`

مسار التشغيل:

1. أنشئ برنامجًا وانشره.
2. أضف مستوى.
3. أنشئ مقررًا واربطه بالبرنامج والمستوى.
4. أنشئ فصلًا ودفعة.
5. أنشئ شعبة.
6. عيّن مدرسًا.
7. سجّل الطالب في الشعبة.
