import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { publicPages } from "@/lib/demo-data";
import { listPublishedPrograms } from "@/lib/academic/academic-core";
import Link from "next/link";

export function generateStaticParams() {
  return publicPages.map((page) => ({ slug: page.slug.split("/") }));
}

const related: Record<string, Array<[string, string]>> = {
  research: [["مختبر التخريج", "/research/takhrij-lab"], ["المواقع البحثية", "/research/hadith-sites"], ["الأبحاث المحكمة", "/research/peer-reviewed"]],
  "scientific-body": [["أعضاء هيئة التدريس", "/scientific-body/faculty"], ["المجلس العلمي", "/scientific-body/scientific-council"]],
  journal: [["الهيئة الاستشارية", "/journal/advisory-board"], ["الأبحاث والأعداد", "/journal/research"]],
  about: [["الرسالة والرؤية", "/about/mission-vision"], ["قالوا عن الكلية", "/about/testimonials"], ["جامعة أبو بكر إبراهيم", "/about/university"]]
};

export default async function PublicContentPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.join("/");
  const page = publicPages.find((item) => item.slug === path);
  if (!page) notFound();
  const programs = path === "curricula" ? await listPublishedPrograms() : [];
  const links = related[path] ?? [];

  return (
    <PublicLayout>
      <PageHero title={page.title} lead={page.lead} />
      <section className="section">
        <div className="container">
          {path === "live" ? <div className="empty-state"><span className="status-dot" /> <h2>لا يوجد بث مباشر الآن</h2><p>ستظهر المحاضرة الحالية والقادمة والتسجيلات هنا عند نشر روابطها الفعلية.</p></div> : null}
          {path === "fees" ? <div className="editorial-grid"><article className="card"><h2>معلومات الرسوم</h2><p>لم تُنشر أسعار معتمدة حاليًا. تواصل مع الكلية عبر القنوات الرسمية عند توفرها.</p></article><article className="card"><h2>سياسة الدعم</h2><p>لا توجد بوابة دفع إلكتروني مفعلة في هذه المرحلة، ولا يجمع الموقع بيانات بطاقات.</p></article></div> : null}
          {path === "store" ? <div className="empty-state"><h2>الفهرس قيد الإعداد</h2><p>لا توجد كتب أو كورسات مدفوعة منشورة للعرض حاليًا. الصفحة لا تتضمن Checkout أو دفعًا إلكترونيًا.</p></div> : null}
          {path === "research/hadith-sites" ? <div className="research-grid">{["الباحث الحديثي","الدرر السنية","المكتبة الشاملة"].map((name) => <article className="research-card" key={name}><h3>{name}</h3><p>مصدر بحثي خارجي اقترحته الإدارة. لم يُنشر رابط موثق له داخل CMS بعد.</p><span className="disabled-link">الرابط غير متاح حاليًا</span></article>)}</div> : null}
          {path === "curricula" ? programs.length ? <div className="record-grid">{programs.map((program) => <article className="mini-record" key={program.id}><b>{program.name_ar}</b><span>{program.duration_text ?? "تفاصيل المدة غير منشورة"}</span><Link className="text-link" href={`/programs/${program.slug}`}>تفاصيل البرنامج والمقررات</Link></article>)}</div> : <div className="empty-state"><h2>لا توجد مناهج منشورة حاليًا</h2><p>ستظهر البرامج والمستويات والمقررات العامة بعد نشرها في النظام الأكاديمي.</p></div> : null}
          {!["live","fees","store","research/hadith-sites","curricula"].includes(path) ? (
            links.length ? <div className="feature-columns">{links.map(([label, href]) => <article key={href}><h2>{label}</h2><Link className="text-link" href={href}>فتح الصفحة</Link></article>)}</div> :
            <div className="empty-state"><h2>المحتوى غير منشور بعد</h2><p>ستظهر المعلومات هنا بعد اعتمادها من إدارة المحتوى. لم نضف بيانات أو ادعاءات بديلة.</p></div>
          ) : null}
        </div>
      </section>
    </PublicLayout>
  );
}
