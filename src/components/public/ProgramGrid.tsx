import Link from "next/link";
import type { ProgramSummary } from "@/lib/academic/academic-core";

export function ProgramGrid({ programs }: { programs: ProgramSummary[] }) {
  if (programs.length === 0) {
    return <div className="notice">لا توجد برامج منشورة حاليًا. ستظهر البرامج هنا بعد تطبيق migration وseed في Supabase.</div>;
  }

  return (
    <div className="grid-4">
      {programs.map((program) => (
        <article className="program-card reveal visible" key={program.slug}>
          <span className="tag demo">{program.is_featured ? "مميز" : "منشور"}</span>
          <h3>{program.name_ar}</h3>
          <p>{program.short_description}</p>
          <div className="program-meta"><span>{program.duration_text ?? "حسب الخطة"}</span><span>{program.status}</span></div>
          <Link className="text-link" href={`/programs/${program.slug}`}>تفاصيل البرنامج</Link>
        </article>
      ))}
    </div>
  );
}
