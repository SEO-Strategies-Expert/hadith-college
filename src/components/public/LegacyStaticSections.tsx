import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const legacyFiles: Record<string, string> = {
  about: "about.html", admissions: "admissions.html", contact: "contact.html", courses: "courses.html", faculty: "faculty.html",
  "hadith-research-sites": "hadith-research-sites.html", ijazat: "ijazat.html", library: "library.html",
  "manuscripts-lab": "manuscripts-lab.html", news: "news.html", "program-foundation": "program-foundation.html",
  "program-higher": "program-higher.html", "program-manuscripts": "program-manuscripts.html",
  "program-takhrij": "program-takhrij.html", programs: "programs.html", publications: "publications.html", "takhrij-lab": "takhrij-lab.html",
};

const routeTargets: Record<string, string> = {
  "index.html": "/", "about.html": "/about", "admissions.html": "/admissions", "contact.html": "/contact",
  "courses.html": "/courses", "faculty.html": "/faculty", "hadith-research-sites.html": "/hadith-research-sites", "ijazat.html": "/ijazat",
  "library.html": "/library", "manuscripts-lab.html": "/manuscripts-lab", "news.html": "/news",
  "program-foundation.html": "/program-foundation", "program-higher.html": "/program-higher",
  "program-manuscripts.html": "/program-manuscripts", "program-takhrij.html": "/program-takhrij",
  "publications.html": "/publications", "student-dashboard.html": "/dashboard/student", "takhrij-lab.html": "/takhrij-lab",
};

function extractMain(html: string) {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!match) throw new Error("Legacy page is missing its main content.");
  return Object.entries(routeTargets).reduce((content, [from, to]) => content.replaceAll(`href="${from}"`, `href="${to}"`), match[1]);
}

export function hasLegacyStaticSections(route: string) {
  return route in legacyFiles;
}

export async function LegacyStaticSections({ route }: { route: string }) {
  const filename = legacyFiles[route];
  if (!filename) return null;
  const html = await readFile(path.join(process.cwd(), "legacy-static", filename), "utf8");
  return <div className="legacy-static-sections" dangerouslySetInnerHTML={{ __html: extractMain(html) }} />;
}
