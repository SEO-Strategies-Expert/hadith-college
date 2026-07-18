import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LooseDatabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SelectOption = { id: string; label: string };

export type ProgramSummary = {
  id: string;
  slug: string;
  name_ar: string;
  short_description: string | null;
  full_description: string | null;
  duration_text: string | null;
  status: string;
  is_featured: boolean;
  sort_order: number;
};

export type CourseSummary = {
  id: string;
  code: string;
  slug: string;
  name_ar: string;
  description: string | null;
  status: string;
  credit_hours: number;
};

export type RoleOption = { id: string; slug: string; name_ar: string };
export type UserListRow = {
  id: string;
  email: string;
  full_name_ar: string | null;
  full_name_en: string | null;
  status: string;
  created_at: string;
  user_roles?: Array<{ roles: RoleOption | RoleOption[] | null }>;
};
export type FacultyPublic = {
  id: string;
  full_name_ar: string;
  slug: string;
  academic_title: string | null;
  specialization: string | null;
  bio_short: string | null;
  profile_image: string | null;
  public_email: string | null;
  sort_order: number;
};
export type FacultyDetail = FacultyPublic & {
  bio_full: string | null;
  degree: string | null;
  university: string | null;
  ijazat_summary: string | null;
  office_hours: string | null;
  cv_file: string | null;
};
export type ProgramDetail = ProgramSummary & {
  study_language: string | null;
  study_mode: string | null;
  certificate_type: string | null;
  admission_requirements: string | null;
  program_courses?: Array<{ courses?: { id: string; code: string; name_ar: string; description: string | null; credit_hours: number; slug: string } | null }>;
};
export type FacultyAdmin = FacultyPublic & {
  status: string;
  public_email: string | null;
};
export type StudentAdmin = {
  id: string;
  user_id: string | null;
  student_number: string;
  full_name_ar: string;
  email: string;
  academic_status: string;
  fee_status: string;
  academic_programs?: { name_ar: string } | null;
};
export type ProgramAdmin = ProgramSummary & {
  program_levels?: Array<{ id: string; name_ar: string; level_number: number }>;
  program_courses?: Array<{ courses?: { id: string; code: string; name_ar: string } | null }>;
};
export type CourseAdmin = CourseSummary & {
  program_courses?: Array<{ academic_programs?: { id: string; name_ar: string } | null; program_levels?: { id: string; name_ar: string } | null }>;
};
export type TermRow = { id: string; name_ar: string; starts_at: string; ends_at: string; status: string };
export type CohortRow = { id: string; name_ar: string; status: string; capacity: number | null; academic_programs?: { name_ar: string } | null; academic_terms?: { name_ar: string } | null };
export type SectionRow = {
  id: string;
  section_code: string;
  capacity: number;
  status: string;
  courses?: { id?: string; code: string; name_ar: string } | null;
  academic_terms?: { name_ar: string } | null;
  cohorts?: { name_ar: string } | null;
  enrollments?: Array<{ id: string }>;
  course_instructors?: Array<{ faculty_profiles?: { id?: string; full_name_ar: string } | null }>;
};
export type FacultySection = SectionRow & {
  courses?: { id: string; code: string; name_ar: string } | null;
  course_modules?: Array<{ id: string; title_ar: string; status: string; lessons?: Array<{ id: string; title_ar: string; status: string }> }>;
};
export type StudentDashboardRow = {
  id: string;
  full_name_ar: string;
  student_number: string;
  academic_status: string;
  academic_programs?: { name_ar: string } | null;
  program_levels?: { name_ar: string } | null;
};
export type StudentEnrollment = {
  id: string;
  course_sections?: (SectionRow & {
    courses?: { id: string; code: string; name_ar: string } | null;
    course_modules?: Array<{ id: string; title_ar: string; status: string; lessons?: Array<{ id: string; title_ar: string; status: string; content_text?: string | null; video_url?: string | null; pdf_url?: string | null }> }>;
  }) | null;
};

export async function getAdminClientOrNull() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  return createAdminClient();
}

async function getPublicAcademicClient(): Promise<SupabaseClient<LooseDatabase> | null> {
  if (!isSupabaseConfigured()) return null;
  return (await createClient()) as unknown as SupabaseClient<LooseDatabase>;
}

export async function listRoles() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin.from("roles").select("id, slug, name_ar").order("slug");
  return (data ?? []) as unknown as RoleOption[];
}

export async function listProfiles(params: { q?: string; role?: string; status?: string; page?: number; pageSize?: number }) {
  const admin = await getAdminClientOrNull();
  if (!admin) return { rows: [], count: 0, authUsers: new Map<string, string | null>() };

  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 20, 5), 100);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = admin
    .from("profiles")
    .select("id, email, full_name_ar, full_name_en, status, created_at, user_roles(roles(id, slug, name_ar))", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.q) {
    query = query.or(`email.ilike.%${params.q}%,full_name_ar.ilike.%${params.q}%,full_name_en.ilike.%${params.q}%`);
  }
  if (params.status) {
    query = query.eq("status", params.status);
  }
  if (params.role) {
    query = query.eq("user_roles.roles.slug", params.role);
  }

  const { data, count } = await query;
  const rows = (data ?? []) as unknown as UserListRow[];
  const ids = rows.map((item) => item.id);
  const lastSignIn = new Map<string, string | null>();

  if (ids.length > 0) {
    const { data: authData } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    for (const user of authData.users) {
      if (ids.includes(user.id)) {
        lastSignIn.set(user.id, user.last_sign_in_at ?? null);
      }
    }
  }

  return { rows, count: count ?? 0, authUsers: lastSignIn };
}

export async function listFaculty() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("faculty_profiles")
    .select("*, profiles(email)")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as FacultyAdmin[];
}

export async function listPublishedFaculty() {
  const supabase = await getPublicAcademicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("faculty_profiles")
    .select("id, full_name_ar, slug, academic_title, specialization, bio_short, profile_image, public_email, sort_order")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return (data ?? []) as unknown as FacultyPublic[];
}

export async function getPublishedFaculty(slug: string) {
  const supabase = await getPublicAcademicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("faculty_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();
  return data as unknown as FacultyDetail | null;
}

export async function listStudents(params: { q?: string; status?: string } = {}) {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  let query = admin
    .from("student_profiles")
    .select("*, academic_programs(name_ar), program_levels(name_ar)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (params.q) {
    query = query.or(`email.ilike.%${params.q}%,full_name_ar.ilike.%${params.q}%,student_number.ilike.%${params.q}%`);
  }
  if (params.status) {
    query = query.eq("academic_status", params.status);
  }

  const { data } = await query;
  return (data ?? []) as unknown as StudentAdmin[];
}

export async function listPrograms() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("academic_programs")
    .select("*, program_levels(id, level_number, name_ar), program_courses(courses(id, code, name_ar))")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return (data ?? []) as unknown as ProgramAdmin[];
}

export async function listPublishedPrograms() {
  const supabase = await getPublicAcademicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("academic_programs")
    .select("id, slug, name_ar, short_description, full_description, duration_text, status, is_featured, sort_order")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  return (data ?? []) as unknown as ProgramSummary[];
}

export async function getPublishedProgram(slug: string) {
  const supabase = await getPublicAcademicClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("academic_programs")
    .select("*, program_levels(id, level_number, name_ar, description), program_courses(courses(id, code, name_ar, description, credit_hours, slug))")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  return data as unknown as ProgramDetail | null;
}

export async function listCourses() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("courses")
    .select("*, program_courses(academic_programs(id, name_ar), program_levels(id, name_ar))")
    .is("deleted_at", null)
    .order("code", { ascending: true });
  return (data ?? []) as unknown as CourseAdmin[];
}

export async function listTerms() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin.from("academic_terms").select("*").order("starts_at", { ascending: false });
  return (data ?? []) as unknown as TermRow[];
}

export async function listCohorts() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("cohorts")
    .select("*, academic_programs(name_ar), academic_terms(name_ar)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as CohortRow[];
}

export async function listSections() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("course_sections")
    .select("*, courses(code, name_ar), academic_terms(name_ar), cohorts(name_ar), course_instructors(faculty_profiles(id, full_name_ar)), enrollments(id)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as SectionRow[];
}

export async function getSelectOptions() {
  const [programs, courses, terms, cohorts, faculty, students] = await Promise.all([
    listPrograms(),
    listCourses(),
    listTerms(),
    listCohorts(),
    listFaculty(),
    listStudents()
  ]);

  return {
    programs: programs.map((item) => ({ id: String(item.id), label: String(item.name_ar ?? "") })),
    levels: programs.flatMap((program) =>
      ((program.program_levels as Array<{ id: string; name_ar: string }> | undefined) ?? []).map((level) => ({ id: level.id, label: `${String(program.name_ar ?? "")} - ${level.name_ar}` }))
    ),
    courses: courses.map((item) => ({ id: String(item.id), label: `${String(item.code ?? "")} - ${String(item.name_ar ?? "")}` })),
    terms: terms.map((item) => ({ id: String(item.id), label: String(item.name_ar ?? "") })),
    cohorts: cohorts.map((item) => ({ id: String(item.id), label: String(item.name_ar ?? "") })),
    faculty: faculty.map((item) => ({ id: String(item.id), label: String(item.full_name_ar ?? "") })),
    students: students.map((item) => ({ id: String(item.id), label: `${String(item.student_number ?? "")} - ${String(item.full_name_ar ?? "")}` }))
  };
}

export async function getFacultyCoursesForUser(userId: string) {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("course_sections")
    .select("*, courses(id, code, name_ar), academic_terms(name_ar), course_instructors!inner(faculty_profiles!inner(user_id, full_name_ar)), course_modules(id, title_ar, status, lessons(id, title_ar, status))")
    .eq("course_instructors.faculty_profiles.user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as FacultySection[];
}

export async function getSectionForFaculty(sectionId: string, userId: string) {
  const sections = await getFacultyCoursesForUser(userId);
  return sections.find((section) => section.id === sectionId) ?? null;
}

export async function getStudentDashboard(userId: string) {
  const admin = await getAdminClientOrNull();
  if (!admin) return null;
  const { data: student } = await admin
    .from("student_profiles")
    .select("*, academic_programs(name_ar), program_levels(name_ar)")
    .eq("user_id", userId)
    .maybeSingle();

  if (!student) return null;

  const { data: enrollments } = await admin
    .from("enrollments")
    .select("*, course_sections(id, section_code, courses(id, code, name_ar), academic_terms(name_ar), course_modules(id, title_ar, status, lessons(id, title_ar, status, content_text, video_url, pdf_url)))")
    .eq("student_id", String((student as Record<string, unknown>).id))
    .eq("status", "active");

  return { student: student as unknown as StudentDashboardRow, enrollments: (enrollments ?? []) as unknown as StudentEnrollment[] };
}
