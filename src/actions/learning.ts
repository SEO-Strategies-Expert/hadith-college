"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/auth/dashboard";
import { createAdminClient } from "@/lib/supabase/admin";

function read(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export async function createModule(formData: FormData) {
  const session = await requireDashboardUser("faculty");
  if (!session) redirect("/dashboard/faculty/courses");

  const sectionId = read(formData, "section_id");
  const courseId = read(formData, "course_id");
  const titleAr = read(formData, "title_ar");
  if (!sectionId || !courseId || !titleAr) redirect("/dashboard/faculty/courses?error=missing-module");

  const admin = createAdminClient();
  const { data: allowed } = await admin
    .from("course_instructors")
    .select("section_id, faculty_profiles!inner(user_id)")
    .eq("section_id", sectionId)
    .eq("faculty_profiles.user_id", session.user.id)
    .maybeSingle();

  if (!allowed) redirect("/dashboard/faculty/courses?error=unauthorized-section");

  await admin.from("course_modules").insert({
    section_id: sectionId,
    course_id: courseId,
    title_ar: titleAr,
    description: read(formData, "description"),
    sort_order: Number(read(formData, "sort_order") ?? 0),
    status: read(formData, "status") ?? "draft",
    available_at: read(formData, "available_at"),
    created_by: session.user.id
  });

  revalidatePath(`/dashboard/faculty/courses/${sectionId}`);
  redirect(`/dashboard/faculty/courses/${sectionId}?saved=module`);
}

export async function createLesson(formData: FormData) {
  const session = await requireDashboardUser("faculty");
  if (!session) redirect("/dashboard/faculty/courses");

  const sectionId = read(formData, "section_id");
  const moduleId = read(formData, "module_id");
  const titleAr = read(formData, "title_ar");
  if (!sectionId || !moduleId || !titleAr) redirect("/dashboard/faculty/courses?error=missing-lesson");

  const admin = createAdminClient();
  const { data: allowed } = await admin
    .from("course_instructors")
    .select("section_id, faculty_profiles!inner(user_id)")
    .eq("section_id", sectionId)
    .eq("faculty_profiles.user_id", session.user.id)
    .maybeSingle();

  if (!allowed) redirect("/dashboard/faculty/courses?error=unauthorized-section");

  await admin.from("lessons").insert({
    module_id: moduleId,
    title_ar: titleAr,
    content_text: read(formData, "content_text"),
    video_url: read(formData, "video_url"),
    audio_url: read(formData, "audio_url"),
    pdf_url: read(formData, "pdf_url"),
    external_url: read(formData, "external_url"),
    references_text: read(formData, "references_text"),
    sort_order: Number(read(formData, "sort_order") ?? 0),
    status: read(formData, "status") ?? "draft",
    available_at: read(formData, "available_at"),
    created_by: session.user.id
  });

  revalidatePath(`/dashboard/faculty/courses/${sectionId}`);
  redirect(`/dashboard/faculty/courses/${sectionId}?saved=lesson`);
}

export async function markLessonProgress(formData: FormData) {
  const session = await requireDashboardUser("student");
  if (!session) redirect("/dashboard/student");

  const lessonId = read(formData, "lesson_id");
  const progress = Number(read(formData, "progress_percentage") ?? 100);
  if (!lessonId) redirect("/dashboard/student/courses?error=missing-lesson");

  const admin = createAdminClient();
  const { data: student } = await admin.from("student_profiles").select("id").eq("user_id", session.user.id).maybeSingle();
  if (!student) redirect("/dashboard/student?error=student-profile-missing");

  await admin.from("lesson_progress").upsert({
    student_id: student.id,
    lesson_id: lessonId,
    started_at: new Date().toISOString(),
    completed_at: progress >= 100 ? new Date().toISOString() : null,
    progress_percentage: progress,
    last_position: read(formData, "last_position"),
    is_completed: progress >= 100
  }, { onConflict: "student_id,lesson_id" });

  revalidatePath("/dashboard/student");
  redirect("/dashboard/student?saved=progress");
}
