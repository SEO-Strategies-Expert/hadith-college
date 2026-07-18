import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/20260718001000_academic_core_mvp.sql"), "utf8");
const seed = readFileSync(join(process.cwd(), "supabase/seed.sql"), "utf8");

describe("academic core migration", () => {
  it("creates the academic core tables", () => {
    [
      "faculty_profiles",
      "student_profiles",
      "academic_programs",
      "program_levels",
      "courses",
      "program_courses",
      "academic_terms",
      "cohorts",
      "course_sections",
      "course_instructors",
      "enrollments",
      "course_modules",
      "lessons",
      "lesson_resources",
      "lesson_progress"
    ].forEach((table) => {
      expect(migration).toContain(`public.${table}`);
    });
  });

  it("includes RLS functions and policies for the required access boundaries", () => {
    [
      "public.is_student_enrolled",
      "public.is_section_instructor",
      "public.can_access_lesson",
      "students_select_self_or_admin",
      "sections_select_authorized",
      "programs_public_read_published",
      "modules_manage_instructor",
      "lessons_manage_instructor",
      "progress_upsert_self"
    ].forEach((needle) => {
      expect(migration).toContain(needle);
    });
  });

  it("prevents duplicate enrollment and enforces section capacity", () => {
    expect(migration).toContain("unique (section_id, student_id)");
    expect(migration).toContain("public.enforce_section_capacity");
  });

  it("creates the requested storage buckets and blocks executable uploads", () => {
    ["public-assets", "faculty-avatars", "course-materials"].forEach((bucket) => {
      expect(migration).toContain(bucket);
    });
    expect(migration).toContain("exe|bat|cmd|msi|dll|ps1|sh|php|js|jar");
  });
});

describe("academic seed data", () => {
  it("moves the six public programs into Supabase seed data", () => {
    ["foundation", "takhrij", "manuscripts", "higher", "ijazat", "short-courses"].forEach((slug) => {
      expect(seed).toContain(`'${slug}'`);
    });
  });
});
