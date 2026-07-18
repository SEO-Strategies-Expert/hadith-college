import type { MetadataRoute } from "next";
import { programs, publicPages } from "@/lib/demo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://hadith-college.vercel.app";
  return [
    { url: `${base}/`, lastModified: new Date() },
    ...publicPages.map((page) => ({ url: `${base}/${page.slug}`, lastModified: new Date() })),
    { url: `${base}/programs`, lastModified: new Date() },
    ...programs.map((program) => ({ url: `${base}${program.href}`, lastModified: new Date() }))
  ];
}
