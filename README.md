# كلية الحديث وعلومه

منصة Next.js قيد التحويل من نسخة Static HTML إلى نظام إنتاجي قابل للإدارة.

## الحالة الحالية

- الفرع الحالي للتطوير: `feat/full-college-platform`
- نسخة الموقع الثابت محفوظة في: `legacy-static/`
- الأصول العامة في: `public/assets/`
- تقرير الفحص: `docs/CURRENT-SITE-AUDIT.md`
- حالة التنفيذ: `docs/IMPLEMENTATION-STATUS.md`

هذه المرحلة لا تمثل اكتمال المنصة الإنتاجية. تسجيل الدخول، قاعدة البيانات، RLS، وإدارة المحتوى الحقيقية لم تربط بعد.

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح:

```text
http://localhost:3000
```

## الفحوصات

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Vercel

المشروع الآن Next.js:

- Framework Preset: Next.js
- Root Directory: `./`
- Build Command: `npm run build`

لا تنشئ مشروع Vercel جديدًا. استخدم المشروع الحالي `hadith-college`.
