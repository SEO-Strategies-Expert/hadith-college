import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/PageHero";
import { PublicLayout } from "@/components/public/PublicLayout";
import { getPublishedProgram } from "@/lib/academic/academic-core";

export const dynamic = "force-dynamic";

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await getPublishedProgram(slug);
  const degreeLabels: Record<string, string> = { bachelor: "البكالوريوس", master: "الماجستير", doctorate: "الدكتوراه" };
  if (!program && !degreeLabels[slug]) notFound();
  if (!program) {
    return <PublicLayout><PageHero title={degreeLabels[slug]} lead={`برامج ${degreeLabels[slug]} المنشورة ستظهر هنا عند اعتمادها في النظام الأكاديمي.`} /><section className="section"><div className="container empty-state"><h2>لا يوجد برنامج منشور حاليًا</h2><p>لم نضف اسم برنامج أو مدة أو رسومًا افتراضية.</p></div></section></PublicLayout>;
  }

  return (
    <PublicLayout>
      <PageHero title={program.name_ar} lead={program.short_description ?? ""} />
      <section className="section">
        <div className="container grid-2">
          <article className="prose">
            <span className="section-kicker">محتوى البرنامج</span>
            <h2>{program.duration_text ?? "خطة أكاديمية مرنة"}</h2>
            <p>{program.full_description ?? program.short_description}</p>
            <ul>
              <li>لغة الدراسة: {program.study_language ?? "العربية"}</li>
              <li>نمط الدراسة: {program.study_mode ?? "online"}</li>
              <li>الشهادة: {program.certificate_type ?? "شهادة إتمام"}</li>
              <li>شروط القبول: {program.admission_requirements ?? "حسب إعلان القبول"}</li>
            </ul>
          </article>
          <article className="card">
            <span className="tag demo">Supabase</span>
            <h2 style={{ fontSize: 30 }}>المقررات المرتبطة</h2>
            <div className="stack-list">
              {(program.program_courses ?? []).map((item: { courses?: { id: string; code: string; name_ar: string; credit_hours: number } | null }) => item.courses ? (
                <div className="mini-row" key={item.courses.id}>
                  <b>{item.courses.code}</b>
                  <span>{item.courses.name_ar}</span>
                  <small>{item.courses.credit_hours} ساعات</small>
                </div>
              ) : null)}
            </div>
          </article>
        </div>
      </section>
    </PublicLayout>
  );
}
