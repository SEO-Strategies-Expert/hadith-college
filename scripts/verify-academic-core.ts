import { createClient } from "@supabase/supabase-js";
import type { LooseDatabase } from "../src/lib/supabase/admin";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable.`);
  return value;
}

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const publishableKey = requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const service = createClient<LooseDatabase>(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

const runId = Date.now();
const tempUsers: string[] = [];
const created = {
  programId: "",
  levelId: "",
  courseId: "",
  termId: "",
  cohortId: "",
  sectionId: "",
  facultyId: "",
  studentId: "",
  moduleId: "",
  lessonId: ""
};

function password() {
  return crypto.randomUUID() + crypto.randomUUID();
}

async function createUser(email: string, roleSlug: string, fullName: string) {
  const userPassword = password();
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: userPassword,
    email_confirm: true,
    user_metadata: { full_name_ar: fullName }
  });
  if (error || !data.user) throw new Error(`create-user-${roleSlug}: ${error?.message ?? "missing user"}`);
  tempUsers.push(data.user.id);

  await service.from("profiles").upsert({ id: data.user.id, email, full_name_ar: fullName, status: "active" });
  const { data: role } = await service.from("roles").select("id").eq("slug", roleSlug).single();
  await service.from("user_roles").upsert({ user_id: data.user.id, role_id: role?.id });

  const client = createClient<LooseDatabase>(url, publishableKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error: signInError } = await client.auth.signInWithPassword({ email, password: userPassword });
  if (signInError) throw new Error(`sign-in-${roleSlug}: ${signInError.message}`);
  return { id: data.user.id, client };
}

async function main() {
  console.log("ACADEMIC_VERIFY_STAGE=create-users");
  const admin = await createUser(`academic-admin-${runId}@example.invalid`, "academic_admin", "مدير أكاديمي مؤقت");
  const instructor = await createUser(`instructor-${runId}@example.invalid`, "instructor", "مدرس مؤقت");
  const student = await createUser(`student-${runId}@example.invalid`, "student", "طالب مؤقت");
  const otherStudent = await createUser(`other-student-${runId}@example.invalid`, "student", "طالب آخر مؤقت");

  console.log("ACADEMIC_VERIFY_STAGE=admin-program-course-section");
  const { data: program } = await admin.client.from("academic_programs").insert({
    name_ar: `برنامج تحقق ${runId}`,
    slug: `verify-program-${runId}`,
    short_description: "برنامج تحقق مؤقت",
    status: "published",
    sort_order: 999
  }).select("id").single();
  created.programId = String(program?.id);

  const { data: level } = await admin.client.from("program_levels").insert({
    program_id: created.programId,
    level_number: 1,
    name_ar: "المستوى الأول",
    status: "published"
  }).select("id").single();
  created.levelId = String(level?.id);

  const { data: course } = await admin.client.from("courses").insert({
    code: `V${runId}`,
    name_ar: `مقرر تحقق ${runId}`,
    slug: `verify-course-${runId}`,
    description: "مقرر تحقق مؤقت",
    credit_hours: 1,
    status: "published"
  }).select("id").single();
  created.courseId = String(course?.id);

  await admin.client.from("program_courses").insert({ program_id: created.programId, level_id: created.levelId, course_id: created.courseId });

  const { data: term } = await admin.client.from("academic_terms").insert({
    name_ar: `فصل تحقق ${runId}`,
    slug: `verify-term-${runId}`,
    starts_at: "2026-08-01",
    ends_at: "2026-12-30",
    status: "published"
  }).select("id").single();
  created.termId = String(term?.id);

  const { data: cohort } = await admin.client.from("cohorts").insert({
    program_id: created.programId,
    term_id: created.termId,
    name_ar: `دفعة تحقق ${runId}`,
    slug: `verify-cohort-${runId}`,
    capacity: 10,
    status: "published"
  }).select("id").single();
  created.cohortId = String(cohort?.id);

  const { data: section } = await admin.client.from("course_sections").insert({
    course_id: created.courseId,
    term_id: created.termId,
    cohort_id: created.cohortId,
    section_code: `SEC-${runId}`,
    capacity: 2,
    status: "published"
  }).select("id").single();
  created.sectionId = String(section?.id);

  console.log("ACADEMIC_VERIFY_STAGE=faculty-student-enrollment");
  const { data: faculty } = await admin.client.from("faculty_profiles").insert({
    user_id: instructor.id,
    full_name_ar: "مدرس تحقق مؤقت",
    slug: `verify-faculty-${runId}`,
    status: "published"
  }).select("id").single();
  created.facultyId = String(faculty?.id);
  await admin.client.from("course_instructors").insert({ section_id: created.sectionId, faculty_id: created.facultyId });

  const { data: studentProfile } = await admin.client.from("student_profiles").insert({
    user_id: student.id,
    student_number: `S-${runId}`,
    full_name_ar: "طالب تحقق مؤقت",
    email: `student-${runId}@example.invalid`,
    academic_status: "active",
    program_id: created.programId,
    current_level_id: created.levelId
  }).select("id").single();
  created.studentId = String(studentProfile?.id);
  await admin.client.from("enrollments").insert({ section_id: created.sectionId, student_id: created.studentId, status: "active" });

  console.log("ACADEMIC_VERIFY_STAGE=instructor-lesson");
  const { data: moduleRow } = await instructor.client.from("course_modules").insert({
    course_id: created.courseId,
    section_id: created.sectionId,
    title_ar: "وحدة تحقق",
    status: "published"
  }).select("id").single();
  created.moduleId = String(moduleRow?.id);

  const { data: lesson } = await instructor.client.from("lessons").insert({
    module_id: created.moduleId,
    title_ar: "درس تحقق منشور",
    content_text: "محتوى درس تحقق",
    status: "published"
  }).select("id").single();
  created.lessonId = String(lesson?.id);

  console.log("ACADEMIC_VERIFY_STAGE=student-progress");
  const { data: visibleLessons } = await student.client.from("lessons").select("id").eq("id", created.lessonId);
  if ((visibleLessons ?? []).length !== 1) throw new Error("enrolled student could not read published lesson.");

  await student.client.from("lesson_progress").insert({
    student_id: created.studentId,
    lesson_id: created.lessonId,
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    progress_percentage: 100,
    is_completed: true
  });

  console.log("ACADEMIC_VERIFY_STAGE=rls-negative-checks");
  const { data: otherLessons } = await otherStudent.client.from("lessons").select("id").eq("id", created.lessonId);
  if ((otherLessons ?? []).length !== 0) throw new Error("unenrolled student can read lesson.");

  const { error: instructorProgramUpdate } = await instructor.client.from("academic_programs").update({ name_ar: "محاولة ممنوعة" }).eq("id", created.programId);
  if (!instructorProgramUpdate) throw new Error("instructor can update academic programs.");

  console.log("ACADEMIC_CORE_VERIFICATION=passed");
}

async function cleanup() {
  await service.from("lesson_progress").delete().eq("lesson_id", created.lessonId);
  await service.from("lessons").delete().eq("id", created.lessonId);
  await service.from("course_modules").delete().eq("id", created.moduleId);
  await service.from("enrollments").delete().eq("section_id", created.sectionId);
  await service.from("course_instructors").delete().eq("section_id", created.sectionId);
  await service.from("student_profiles").delete().eq("id", created.studentId);
  await service.from("faculty_profiles").delete().eq("id", created.facultyId);
  await service.from("course_sections").delete().eq("id", created.sectionId);
  await service.from("cohorts").delete().eq("id", created.cohortId);
  await service.from("academic_terms").delete().eq("id", created.termId);
  await service.from("program_courses").delete().eq("program_id", created.programId);
  await service.from("courses").delete().eq("id", created.courseId);
  await service.from("program_levels").delete().eq("id", created.levelId);
  await service.from("academic_programs").delete().eq("id", created.programId);
  for (const userId of tempUsers) {
    await service.from("user_roles").delete().eq("user_id", userId);
    await service.auth.admin.deleteUser(userId);
  }
}

main()
  .finally(cleanup)
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
