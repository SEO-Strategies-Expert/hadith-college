import Link from "next/link";
import { programs } from "@/lib/demo-data";

export function ProgramGrid() {
  return (
    <div className="grid-4">
      {programs.map((program) => (
        <article className="program-card reveal visible" key={program.slug}>
          <span className="tag demo">Demo Seed</span>
          <h3>{program.title}</h3>
          <p>{program.excerpt}</p>
          <div className="program-meta"><span>{program.duration}</span><span>منشور</span></div>
          <Link className="text-link" href={program.href}>تفاصيل البرنامج</Link>
        </article>
      ))}
    </div>
  );
}
