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
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="/assets/img/favicon.png" rel="icon" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
