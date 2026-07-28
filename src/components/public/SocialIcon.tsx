import type { SocialIconName } from "@/lib/public-navigation";

export function SocialIcon({ name }: { name: SocialIconName }) {
  const common = {
    "aria-hidden": true,
    className: `social-icon social-icon--${name}`,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "youtube":
      return <svg {...common}><path d="M21.58 6.19a2.99 2.99 0 0 0-2.1-2.12C17.63 3.57 12 3.57 12 3.57s-5.63 0-7.48.5A3 3 0 0 0 2.42 6.2 31.03 31.03 0 0 0 1.92 12c0 1.96.17 3.91.5 5.81a3 3 0 0 0 2.1 2.12c1.85.5 7.48.5 7.48.5s5.63 0 7.48-.5a3 3 0 0 0 2.1-2.12c.33-1.9.5-3.85.5-5.81 0-1.96-.17-3.91-.5-5.81ZM9.9 15.57V8.43L16.17 12 9.9 15.57Z" fill="currentColor" /></svg>;
    case "facebook":
      return <svg {...common}><path d="M13.5 21v-7h2.34l.35-2.72H13.5V9.55c0-.79.22-1.32 1.35-1.32h1.44V5.8c-.25-.03-1.1-.11-2.1-.11-2.08 0-3.5 1.27-3.5 3.6v2H8.34V14h2.35v7h2.81Z" fill="currentColor" /></svg>;
    case "x":
      return <svg {...common}><path d="M18.9 2.25h3.68l-8.04 9.19L24 21.75h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.84L0 2.25h7.59l5.24 6.93 6.07-6.93Zm-1.29 17.03h2.04L6.48 4.59H4.29L17.61 19.28Z" fill="currentColor" /></svg>;
    case "instagram":
      return <svg {...common} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><rect height="18" rx="5" width="18" x="3" y="3" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>;
    case "telegram":
      return <svg {...common}><path d="m21.7 3.26-3.05 17.16c-.23 1.21-.87 1.5-1.76.94l-4.87-3.59-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96 9.03-8.16c.39-.35-.09-.55-.61-.2L6.69 14.23 1.9 12.73c-1.04-.33-1.06-1.04.22-1.54L20.86 3.96c.87-.33 1.63.2.84-.7Z" fill="currentColor" /></svg>;
    case "link":
      return <svg {...common} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M10.5 13.5a4.5 4.5 0 0 0 6.36.14l2-2a4.5 4.5 0 0 0-6.36-6.36l-1.15 1.14" /><path d="M13.5 10.5a4.5 4.5 0 0 0-6.36-.14l-2 2a4.5 4.5 0 0 0 6.36 6.36l1.14-1.14" /></svg>;
  }
}
