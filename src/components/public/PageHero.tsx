import Link from "next/link";

export function PageHero({ title, lead }: { title: string; lead: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="page-hero-shell">
          <div className="breadcrumbs"><Link href="/">الرئيسية</Link><span>◆</span><span>{title}</span></div>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
        </div>
      </div>
    </section>
  );
}
