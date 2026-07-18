import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: process.cwd()
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/programs.html", destination: "/programs", permanent: true },
      { source: "/admissions.html", destination: "/admissions", permanent: true },
      { source: "/student-dashboard.html", destination: "/dashboard/student", permanent: true },
      { source: "/dashboards/dashboard-student.html", destination: "/dashboard/student", permanent: true },
      { source: "/dashboards/dashboard-admin.html", destination: "/dashboard/admin", permanent: true },
      { source: "/dashboards/dashboard-faculty.html", destination: "/dashboard/faculty", permanent: true },
      { source: "/dashboards/research-sites-admin.html", destination: "/dashboard/admin/research-sites", permanent: true },
      { source: "/hadith-research-sites.html", destination: "/research-sites", permanent: true },
      { source: "/takhrij-lab.html", destination: "/takhrij-lab", permanent: true },
      { source: "/manuscripts-lab.html", destination: "/manuscripts-lab", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
        ]
      }
    ];
  }
};

export default nextConfig;
