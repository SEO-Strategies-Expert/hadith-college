import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://hadith-college.vercel.app"),
  title: {
    default: "كلية الحديث وعلومه",
    template: "%s | كلية الحديث وعلومه"
  },
  description: "منصة عربية متخصصة في علوم الحديث رواية ودراية، والتخريج، والتحقيق، وعلوم المخطوطات.",
  openGraph: {
    title: "كلية الحديث وعلومه",
    description: "منصة عربية متخصصة في علوم الحديث والرواية والدراية والتحقيق.",
    locale: "ar",
    type: "website",
    images: [{ url: "/brand/hadith-college-logo-512.webp", width: 512, height: 512, alt: "شعار كلية الحديث وعلومه" }]
  },
  icons: {
    icon: [
      { url: "/brand/hadith-college-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/hadith-college-icon-64.png", sizes: "64x64", type: "image/png" }
    ],
    apple: "/brand/hadith-college-logo-128.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
