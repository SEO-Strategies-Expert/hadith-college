"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

function read(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

function numberOrNull(formData: FormData, key: string) {
  const raw = read(formData, key);
  return raw === null ? null : Number(raw);
}

function checked(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

export async function upsertProgram(formData: FormData) {
  const id = read(formData, "id");
  const nameAr = read(formData, "name_ar");
  const slug = read(formData, "slug");
  if (!nameAr || !slug) redirect("/dashboard/admin/academic/programs?error=missing-fields");

  const payload = {
    name_ar: nameAr,
    name_en: read(formData, "name_en"),
    slug,
    short_description: read(formData, "short_description"),
    full_description: read(formData, "full_description"),
    program_type: read(formData, "program_type"),
    qualification_type: read(formData, "qualification_type"),
    duration_text: read(formData, "duration_text"),
    duration_months: numberOrNull(formData, "duration_months"),
    number_of_levels: numberOrNull(formData, "number_of_levels"),
    credit_hours: numberOrNull(formData, "credit_hours"),
    study_language: read(formData, "study_language"),
    study_mode: read(formData, "study_mode"),
    target_audience: read(formData, "target_audience"),
    admission_requirements: read(formData, "admission_requirements"),
    learning_outcomes: read(formData, "learning_outcomes"),
    certificate_type: read(formData, "certificate_type"),
    registration_open_at: read(formData, "registration_open_at"),
    registration_close_at: read(formData, "registration_close_at"),
    study_start_at: read(formData, "study_start_at"),
    study_end_at: read(formData, "study_end_at"),
    capacity: numberOrNull(formData, "capacity"),
    status: read(formData, "status") ?? "draft",
    featured_image: read(formData, "featured_image"),
    is_featured: checked(formData, "is_featured"),
    sort_order: Number(read(formData, "sort_order") ?? 0),
    seo_title: read(formData, "seo_title"),
    seo_description: read(formData, "seo_description")
  };

  const admin = createAdminClient();
  if (id) await admin.from("academic_programs").update(payload).eq("id", id);
  else await admin.from("academic_programs").insert(payload);
  revalidatePath("/dashboard/admin/academic/programs");
  revalidatePath("/programs");
  redirect("/dashboard/admin/academic/programs?saved=program");
}

export async function updateProgramStatus(formData: FormData) {
  const id = read(formData, "id");
  const status = read(formData, "status") ?? "draft";
  if (!id) redirect("/dashboard/admin/academic/programs?error=missing-id");
  const admin = createAdminClient();
  await admin.from("academic_programs").update({ status, deleted_at: status === "archived" ? new Date().toISOString() : null }).eq("id", id);
  revalidatePath("/dashboard/admin/academic/programs");
  revalidatePath("/programs");
  redirect("/dashboard/admin/academic/programs?saved=status");
}

export async function createProgramLevel(formData: FormData) {
  const programId = read(formData, "program_id");
  const nameAr = read(formData, "name_ar");
  if (!programId || !nameAr) redirect("/dashboard/admin/academic/programs?error=missing-level");
  const admin = createAdminClient();
  await admin.from("program_levels").insert({
    program_id: programId,
    level_number: Number(read(formData, "level_number") ?? 1),
    name_ar: nameAr,
    description: read(formData, "description"),
    sort_order: Number(read(formData, "sort_order") ?? 0),
    status: read(formData, "status") ?? "published"
  });
  revalidatePath("/dashboard/admin/academic/programs");
  redirect("/dashboard/admin/academic/programs?saved=level");
}

export async function upsertCourse(formData: FormData) {
  const id = read(formData, "id");
  const code = read(formData, "code");
  const nameAr = read(formData, "name_ar");
  const slug = read(formData, "slug");
  if (!code || !nameAr || !slug) redirect("/dashboard/admin/academic/courses?error=missing-fields");

  const admin = createAdminClient();
  const payload = {
    code,
    name_ar: nameAr,
    name_en: read(formData, "name_en"),
    slug,
    description: read(formData, "description"),
    objectives: read(formData, "objectives"),
    credit_hours: Number(read(formData, "credit_hours") ?? 0),
    study_hours: numberOrNull(formData, "study_hours"),
    course_type: read(formData, "course_type"),
    level_id: read(formData, "level_id"),
    status: read(formData, "status") ?? "draft",
    passing_grade: Number(read(formData, "passing_grade") ?? 60),
    attendance_requirement: Number(read(formData, "attendance_requirement") ?? 75),
    featured_image: read(formData, "featured_image")
  };

  let courseId = id;
  if (id) await admin.from("courses").update(payload).eq("id", id);
  else {
    const { data } = await admin.from("courses").insert(payload).select("id").single();
    courseId = data?.id ? String(data.id) : null;
  }

  const programId = read(formData, "program_id");
  if (programId && courseId) {
    await admin.from("program_courses").upsert({
      program_id: programId,
      level_id: read(formData, "level_id"),
      course_id: courseId,
      sort_order: Number(read(formData, "sort_order") ?? 0),
      is_required: checked(formData, "is_required")
    }, { onConflict: "program_id,course_id" });
  }

  const outcome = read(formData, "outcome_ar");
  if (courseId && outcome) {
    await admin.from("course_learning_outcomes").insert({ course_id: courseId, outcome_ar: outcome });
  }

  revalidatePath("/dashboard/admin/academic/courses");
  redirect("/dashboard/admin/academic/courses?saved=course");
}

export async function createTerm(formData: FormData) {
  const nameAr = read(formData, "name_ar");
  const slug = read(formData, "slug");
  const startsAt = read(formData, "starts_at");
  const endsAt = read(formData, "ends_at");
  if (!nameAr || !slug || !startsAt || !endsAt) redirect("/dashboard/admin/academic/terms?error=missing-fields");
  const admin = createAdminClient();
  await admin.from("academic_terms").insert({
    name_ar: nameAr,
    slug,
    starts_at: startsAt,
    ends_at: endsAt,
    registration_opens_at: read(formData, "registration_opens_at"),
    registration_closes_at: read(formData, "registration_closes_at"),
    status: read(formData, "status") ?? "draft"
  });
  revalidatePath("/dashboard/admin/academic/terms");
  redirect("/dashboard/admin/academic/terms?saved=term");
}

export async function createCohort(formData: FormData) {
  const programId = read(formData, "program_id");
  const nameAr = read(formData, "name_ar");
  const slug = read(formData, "slug");
  if (!programId || !nameAr || !slug) redirect("/dashboard/admin/academic/cohorts?error=missing-fields");
  const admin = createAdminClient();
  await admin.from("cohorts").insert({
    program_id: programId,
    term_id: read(formData, "term_id"),
    name_ar: nameAr,
    slug,
    capacity: numberOrNull(formData, "capacity"),
    status: read(formData, "status") ?? "draft"
  });
  revalidatePath("/dashboard/admin/academic/cohorts");
  redirect("/dashboard/admin/academic/cohorts?saved=cohort");
}

export async function createSection(formData: FormData) {
  const courseId = read(formData, "course_id");
  const termId = read(formData, "term_id");
  const sectionCode = read(formData, "section_code");
  if (!courseId || !termId || !sectionCode) redirect("/dashboard/admin/academic/sections?error=missing-fields");
  const admin = createAdminClient();
  await admin.from("course_sections").insert({
    course_id: courseId,
    term_id: termId,
    cohort_id: read(formData, "cohort_id"),
    section_code: sectionCode,
    capacity: Number(read(formData, "capacity") ?? 30),
    starts_at: read(formData, "starts_at"),
    ends_at: read(formData, "ends_at"),
    status: read(formData, "status") ?? "draft",
    meeting_mode: read(formData, "meeting_mode") ?? "online",
    timezone: read(formData, "timezone") ?? "Asia/Qatar"
  });
  revalidatePath("/dashboard/admin/academic/sections");
  redirect("/dashboard/admin/academic/sections?saved=section");
}

export async function assignInstructor(formData: FormData) {
  const sectionId = read(formData, "section_id");
  const facultyId = read(formData, "faculty_id");
  if (!sectionId || !facultyId) redirect("/dashboard/admin/academic/sections?error=missing-instructor");
  const admin = createAdminClient();
  await admin.from("course_instructors").upsert({
    section_id: sectionId,
    faculty_id: facultyId,
    role: read(formData, "role") ?? "instructor"
  });
  revalidatePath("/dashboard/admin/academic/sections");
  redirect("/dashboard/admin/academic/sections?saved=instructor");
}

export async function enrollStudent(formData: FormData) {
  const sectionId = read(formData, "section_id");
  const studentId = read(formData, "student_id");
  if (!sectionId || !studentId) redirect("/dashboard/admin/academic/enrollments?error=missing-enrollment");
  const admin = createAdminClient();
  const { error } = await admin.from("enrollments").upsert({
    section_id: sectionId,
    student_id: studentId,
    status: "active"
  }, { onConflict: "section_id,student_id" });
  if (error) redirect(`/dashboard/admin/academic/enrollments?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard/admin/academic/enrollments");
  redirect("/dashboard/admin/academic/enrollments?saved=enrollment");
}

export async function withdrawStudent(formData: FormData) {
  const enrollmentId = read(formData, "enrollment_id");
  if (!enrollmentId) redirect("/dashboard/admin/academic/enrollments?error=missing-id");
  const admin = createAdminClient();
  await admin.from("enrollments").update({ status: "withdrawn", withdrawn_at: new Date().toISOString() }).eq("id", enrollmentId);
  revalidatePath("/dashboard/admin/academic/enrollments");
  redirect("/dashboard/admin/academic/enrollments?saved=withdrawn");
}
