import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";
import type { LooseDatabase } from "../src/lib/supabase/admin";

type Client = SupabaseClient<LooseDatabase>;
type RpcClient = SupabaseClient<LooseDatabase> & {
  rpc<T = unknown>(fn: string, args?: Record<string, unknown>): Promise<{ data: T | null; error: { message: string } | null }>;
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable.`);
  return value;
}

nextEnv.loadEnvConfig(process.cwd());

const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const publishableKey = requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const service = createClient<LooseDatabase>(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const rpcService = service as RpcClient;

const runId = Date.now();
const tempUsers: string[] = [];
const created: Record<string, string> = {};

function password() {
  return crypto.randomUUID() + crypto.randomUUID();
}

function iso(offsetMinutes: number) {
  return new Date(Date.now() + offsetMinutes * 60_000).toISOString();
}

async function expectRows(client: Client, table: string, filterColumn: string, id: string, label: string, expected: number) {
  const { data, error } = await client.from(table).select("id").eq(filterColumn, id);
  if (error) throw new Error(`${label}: ${error.message}`);
  if ((data ?? []).length !== expected) throw new Error(`${label}: expected ${expected}, received ${(data ?? []).length}.`);
}

async function expectNoMutation<T>(label: string, operation: PromiseLike<{ data: T[] | null; error: { message: string } | null }>) {
  const { data, error } = await operation;
  if (!error && (data ?? []).length > 0) throw new Error(label);
}

async function insertOne(client: Client, table: string, payload: Record<string, unknown>, label: string) {
  const { data, error } = await client.from(table).insert(payload).select("id").single();
  if (error || !data?.id) throw new Error(`${label}: ${error?.message ?? "missing id"}`);
  return String(data.id);
}

async function updateOne(client: Client, table: string, id: string, payload: Record<string, unknown>, label: string) {
  const { data, error } = await client.from(table).update(payload).eq("id", id).select("id").single();
  if (error || !data?.id) throw new Error(`${label}: ${error?.message ?? "missing id"}`);
}

async function insertMany(client: Client, table: string, payload: Array<Record<string, unknown>>, label: string) {
  const { error } = await client.from(table).insert(payload);
  if (error) throw new Error(`${label}: ${error.message}`);
}

async function createUser(email: string, roleSlug: string, fullName: string, status = "active") {
  const userPassword = password();
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: userPassword,
    email_confirm: true,
    user_metadata: { full_name_ar: fullName }
  });
  if (error || !data.user) throw new Error(`create-user-${roleSlug}: ${error?.message ?? "missing user"}`);
  tempUsers.push(data.user.id);

  await service.from("profiles").upsert({ id: data.user.id, email, full_name_ar: fullName, status });
  const { data: role } = await service.from("roles").select("id").eq("slug", roleSlug).single();
  if (!role?.id) throw new Error(`missing role ${roleSlug}`);
  await service.from("user_roles").upsert({ user_id: data.user.id, role_id: role.id });

  const client = createClient<LooseDatabase>(url, publishableKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error: signInError } = await client.auth.signInWithPassword({ email, password: userPassword });
  if (signInError) throw new Error(`sign-in-${roleSlug}: ${signInError.message}`);
  return { id: data.user.id, client };
}

async function createAcademicFoundation(admin: Client) {
  created.programId = await insertOne(admin, "academic_programs", {
    name_ar: `برنامج تشغيل ${runId}`,
    slug: `teaching-program-${runId}`,
    short_description: "برنامج تحقق مؤقت للتشغيل التدريسي",
    status: "published",
    sort_order: 1000
  }, "program");

  created.levelId = await insertOne(admin, "program_levels", {
    program_id: created.programId,
    level_number: 1,
    name_ar: "المستوى الأول",
    status: "published"
  }, "level");

  created.courseId = await insertOne(admin, "courses", {
    code: `TOP-${runId}`,
    name_ar: `مقرر تشغيل ${runId}`,
    slug: `teaching-course-${runId}`,
    description: "مقرر تحقق مؤقت",
    credit_hours: 2,
    status: "published"
  }, "course");

  await admin.from("program_courses").insert({ program_id: created.programId, level_id: created.levelId, course_id: created.courseId });

  created.termId = await insertOne(admin, "academic_terms", {
    name_ar: `فصل تشغيل ${runId}`,
    slug: `teaching-term-${runId}`,
    starts_at: "2026-08-01",
    ends_at: "2026-12-30",
    status: "published"
  }, "term");

  created.cohortId = await insertOne(admin, "cohorts", {
    program_id: created.programId,
    term_id: created.termId,
    name_ar: `دفعة تشغيل ${runId}`,
    slug: `teaching-cohort-${runId}`,
    capacity: 20,
    status: "published"
  }, "cohort");

  created.sectionId = await insertOne(admin, "course_sections", {
    course_id: created.courseId,
    term_id: created.termId,
    cohort_id: created.cohortId,
    section_code: `TOP-A-${runId}`,
    capacity: 10,
    status: "published"
  }, "section");

  created.otherSectionId = await insertOne(admin, "course_sections", {
    course_id: created.courseId,
    term_id: created.termId,
    cohort_id: created.cohortId,
    section_code: `TOP-B-${runId}`,
    capacity: 10,
    status: "published"
  }, "other-section");
}

async function main() {
  console.log("TEACHING_VERIFY_STAGE=create-users");
  const admin = await createUser(`teaching-admin-${runId}@example.invalid`, "academic_admin", "مدير تشغيل مؤقت");
  const instructor = await createUser(`teaching-instructor-${runId}@example.invalid`, "instructor", "مدرس تشغيل مؤقت");
  const otherInstructor = await createUser(`other-instructor-${runId}@example.invalid`, "instructor", "مدرس آخر مؤقت");
  const student = await createUser(`teaching-student-${runId}@example.invalid`, "student", "طالب تشغيل مؤقت");
  const otherStudent = await createUser(`other-teaching-student-${runId}@example.invalid`, "student", "طالب آخر مؤقت");
  const contentEditor = await createUser(`content-editor-${runId}@example.invalid`, "content_editor", "محرر محتوى مؤقت");
  const suspended = await createUser(`suspended-student-${runId}@example.invalid`, "student", "طالب موقوف مؤقت", "suspended");

  console.log("TEACHING_VERIFY_STAGE=academic-foundation");
  await createAcademicFoundation(admin.client);

  created.facultyId = await insertOne(admin.client, "faculty_profiles", {
    user_id: instructor.id,
    full_name_ar: "مدرس تشغيل مؤقت",
    slug: `teaching-faculty-${runId}`,
    status: "published"
  }, "faculty");
  created.otherFacultyId = await insertOne(admin.client, "faculty_profiles", {
    user_id: otherInstructor.id,
    full_name_ar: "مدرس آخر مؤقت",
    slug: `other-teaching-faculty-${runId}`,
    status: "published"
  }, "other-faculty");
  await admin.client.from("course_instructors").insert({ section_id: created.sectionId, faculty_id: created.facultyId });
  await admin.client.from("course_instructors").insert({ section_id: created.otherSectionId, faculty_id: created.otherFacultyId });

  created.studentId = await insertOne(admin.client, "student_profiles", {
    user_id: student.id,
    student_number: `TOP-S-${runId}`,
    full_name_ar: "طالب تشغيل مؤقت",
    email: `teaching-student-${runId}@example.invalid`,
    academic_status: "active",
    program_id: created.programId,
    current_level_id: created.levelId
  }, "student-profile");
  created.otherStudentId = await insertOne(admin.client, "student_profiles", {
    user_id: otherStudent.id,
    student_number: `TOP-O-${runId}`,
    full_name_ar: "طالب آخر مؤقت",
    email: `other-teaching-student-${runId}@example.invalid`,
    academic_status: "active",
    program_id: created.programId,
    current_level_id: created.levelId
  }, "other-student-profile");
  created.suspendedStudentId = await insertOne(admin.client, "student_profiles", {
    user_id: suspended.id,
    student_number: `TOP-X-${runId}`,
    full_name_ar: "طالب موقوف مؤقت",
    email: `suspended-student-${runId}@example.invalid`,
    academic_status: "suspended",
    program_id: created.programId,
    current_level_id: created.levelId
  }, "suspended-student-profile");
  await admin.client.from("enrollments").insert({ section_id: created.sectionId, student_id: created.studentId, status: "active" });
  await admin.client.from("enrollments").insert({ section_id: created.otherSectionId, student_id: created.otherStudentId, status: "active" });
  await admin.client.from("enrollments").insert({ section_id: created.sectionId, student_id: created.suspendedStudentId, status: "active" });

  console.log("TEACHING_VERIFY_STAGE=faculty-creates-operations");
  created.meetingId = await insertOne(instructor.client, "class_meetings", {
    section_id: created.sectionId,
    title: "محاضرة تحقق مباشرة",
    starts_at: iso(60),
    ends_at: iso(120),
    timezone: "Asia/Qatar",
    meeting_mode: "online",
    online_meeting_url: "https://example.invalid/meeting",
    status: "published",
    created_by: instructor.id
  }, "meeting");

  created.classSessionId = await insertOne(instructor.client, "class_sessions", {
    section_id: created.sectionId,
    title: "جلسة حضور تحقق",
    session_at: iso(70),
    created_by: instructor.id
  }, "class-session");
  await instructor.client.from("meeting_attendance_links").insert({ meeting_id: created.meetingId, class_session_id: created.classSessionId });

  created.announcementId = await insertOne(instructor.client, "announcements", {
    section_id: created.sectionId,
    title: "إعلان تحقق",
    body: "إعلان موجه لشعبة الطالب",
    priority: "high",
    published_at: iso(-5),
    status: "published",
    is_pinned: true,
    created_by: instructor.id
  }, "announcement");
  await instructor.client.from("announcement_targets").insert({
    announcement_id: created.announcementId,
    target_type: "section",
    target_id: created.sectionId
  });

  created.assignmentId = await insertOne(instructor.client, "assignments", {
    course_id: created.courseId,
    section_id: created.sectionId,
    title: "واجب تحقق",
    instructions: "اكتب إجابة قصيرة.",
    available_from: iso(-10),
    due_at: iso(180),
    points: 20,
    allow_late_submissions: false,
    status: "published",
    created_by: instructor.id
  }, "assignment");
  await instructor.client.from("assignment_resources").insert({
    assignment_id: created.assignmentId,
    title: "مرجع الواجب",
    resource_url: "https://example.invalid/resource"
  });

  created.expiredAssignmentId = await insertOne(instructor.client, "assignments", {
    course_id: created.courseId,
    section_id: created.sectionId,
    title: "واجب مغلق تحقق",
    available_from: iso(-120),
    due_at: iso(-30),
    points: 10,
    allow_late_submissions: false,
    status: "published",
    created_by: instructor.id
  }, "expired-assignment");

  created.bankId = await insertOne(instructor.client, "question_banks", {
    section_id: created.sectionId,
    course_id: created.courseId,
    title: "بنك تحقق",
    created_by: instructor.id
  }, "question-bank");
  created.mcQuestionId = await insertOne(instructor.client, "questions", {
    bank_id: created.bankId,
    question_type: "multiple_choice",
    prompt: "اختر الإجابة الصحيحة",
    points: 5,
    status: "published",
    created_by: instructor.id
  }, "mc-question");
  created.essayQuestionId = await insertOne(instructor.client, "questions", {
    bank_id: created.bankId,
    question_type: "essay",
    prompt: "اكتب جوابًا مقاليًا",
    points: 5,
    status: "published",
    created_by: instructor.id
  }, "essay-question");
  created.correctOptionId = await insertOne(instructor.client, "question_options", {
    question_id: created.mcQuestionId,
    option_text: "الإجابة الصحيحة",
    is_correct: true,
    sort_order: 1
  }, "correct-option");
  await instructor.client.from("question_options").insert({
    question_id: created.mcQuestionId,
    option_text: "إجابة خاطئة",
    is_correct: false,
    sort_order: 2
  });
  created.quizId = await insertOne(instructor.client, "quizzes", {
    course_id: created.courseId,
    section_id: created.sectionId,
    title: "اختبار تحقق",
    instructions: "اختبار قصير",
    duration_minutes: 30,
    available_from: iso(-10),
    available_until: iso(180),
    attempts_allowed: 1,
    passing_grade: 50,
    show_results: true,
    show_correct_answers: true,
    status: "published",
    created_by: instructor.id
  }, "quiz");
  await insertMany(instructor.client, "quiz_questions", [
    { quiz_id: created.quizId, question_id: created.mcQuestionId, points: 5, sort_order: 1 },
    { quiz_id: created.quizId, question_id: created.essayQuestionId, points: 5, sort_order: 2 }
  ], "quiz-questions");

  created.expiredQuizId = await insertOne(instructor.client, "quizzes", {
    course_id: created.courseId,
    section_id: created.sectionId,
    title: "اختبار منته تحقق",
    available_from: iso(-120),
    available_until: iso(-30),
    attempts_allowed: 1,
    status: "published",
    created_by: instructor.id
  }, "expired-quiz");

  console.log("TEACHING_VERIFY_STAGE=student-participates");
  await expectRows(student.client, "announcements", "id", created.announcementId, "student sees targeted announcement", 1);
  await expectRows(student.client, "class_meetings", "id", created.meetingId, "student sees meeting", 1);
  await expectRows(student.client, "assignments", "id", created.assignmentId, "student sees assignment", 1);
  await expectRows(student.client, "quizzes", "id", created.quizId, "student sees quiz", 1);

  created.submissionId = await insertOne(student.client, "assignment_submissions", {
    assignment_id: created.assignmentId,
    student_id: created.studentId,
    body_text: "إجابة الطالب",
    status: "submitted",
    submitted_at: iso(0),
    is_late: false
  }, "assignment-submission");

  created.attemptId = await insertOne(student.client, "quiz_attempts", {
    quiz_id: created.quizId,
    student_id: created.studentId,
    attempt_number: 1,
    status: "in_progress",
    expires_at: iso(30)
  }, "quiz-attempt");
  await insertMany(student.client, "quiz_answers", [
    { attempt_id: created.attemptId, question_id: created.mcQuestionId, selected_option_ids: [created.correctOptionId] },
    { attempt_id: created.attemptId, question_id: created.essayQuestionId, answer_text: "إجابة مقالية تحتاج تقييمًا", selected_option_ids: [] }
  ], "quiz-answers");
  await updateOne(student.client, "quiz_attempts", created.attemptId, {
    status: "submitted",
    submitted_at: iso(0)
  }, "submit-quiz");
  const { error: gradeError } = await rpcService.rpc("autograde_quiz_attempt", { target_attempt_id: created.attemptId });
  if (gradeError) throw new Error(`autograde: ${gradeError.message}`);

  const { data: autoAttempt } = await service.from("quiz_attempts").select("auto_score, score").eq("id", created.attemptId).single();
  if (Number(autoAttempt?.auto_score ?? 0) !== 5) throw new Error(`objective question was not auto-graded; auto_score=${String(autoAttempt?.auto_score ?? "null")}.`);

  await instructor.client
    .from("quiz_answers")
    .update({ manual_score: 5, feedback: "إجابة جيدة", graded_by: instructor.id, graded_at: iso(0) })
    .eq("attempt_id", created.attemptId)
    .eq("question_id", created.essayQuestionId);
  await instructor.client
    .from("quiz_attempts")
    .update({ manual_score: 5, score: 10, status: "graded", graded_by: instructor.id, graded_at: iso(0) })
    .eq("id", created.attemptId);

  console.log("TEACHING_VERIFY_STAGE=grading-attendance-notifications");
  await updateOne(instructor.client, "assignment_submissions", created.submissionId, {
    grade: 18,
    status: "graded",
    graded_by: instructor.id,
    graded_at: iso(0),
    grade_published_at: iso(0)
  }, "grade-submission");
  created.feedbackId = await insertOne(instructor.client, "submission_feedback", {
    submission_id: created.submissionId,
    feedback_text: "عمل جيد",
    score: 18,
    is_published: true,
    created_by: instructor.id
  }, "submission-feedback");

  created.attendanceId = await insertOne(instructor.client, "attendance_records", {
    class_session_id: created.classSessionId,
    student_id: created.studentId,
    status: "present",
    notes: "حضر في الموعد",
    recorded_by: instructor.id
  }, "attendance");
  await updateOne(instructor.client, "attendance_records", created.attendanceId, { status: "late", notes: "تعديل مع سجل تدقيق" }, "attendance-update");
  created.attendanceRequestId = await insertOne(student.client, "attendance_adjustment_requests", {
    attendance_record_id: created.attendanceId,
    student_id: created.studentId,
    requested_status: "present",
    reason: "وصلت قبل بدء الدرس"
  }, "attendance-request");

  created.categoryId = await insertOne(instructor.client, "grade_categories", {
    section_id: created.sectionId,
    slug: `assignments-${runId}`,
    name_ar: "واجبات",
    weight_percentage: 40
  }, "grade-category");
  created.gradeItemId = await insertOne(instructor.client, "grade_items", {
    category_id: created.categoryId,
    title: "واجب تحقق",
    source_type: "assignment",
    source_id: created.assignmentId,
    points: 20,
    is_published: false,
    created_by: instructor.id
  }, "grade-item");
  created.studentGradeId = await insertOne(instructor.client, "student_grades", {
    grade_item_id: created.gradeItemId,
    student_id: created.studentId,
    score: 18,
    feedback: "منشور بعد الاعتماد",
    is_published: false,
    created_by: instructor.id
  }, "student-grade");
  await expectRows(student.client, "student_grades", "id", created.studentGradeId, "student cannot see unpublished grade", 0);
  await updateOne(instructor.client, "grade_items", created.gradeItemId, { is_published: true }, "publish-grade-item");
  await updateOne(instructor.client, "student_grades", created.studentGradeId, { is_published: true }, "publish-student-grade");
  await expectRows(student.client, "student_grades", "id", created.studentGradeId, "student sees published grade", 1);
  created.finalGradeId = await insertOne(instructor.client, "final_grades", {
    section_id: created.sectionId,
    student_id: created.studentId,
    final_score: 92,
    letter_grade: "A",
    is_published: true,
    published_at: iso(0)
  }, "final-grade");
  await instructor.client.from("grade_publications").insert({ section_id: created.sectionId, published_by: instructor.id, notes: "نشر نتائج التحقق" });

  const { data: notificationId, error: notificationError } = await rpcService.rpc<string>("create_in_app_notification", {
    target_user_id: student.id,
    event: "grade.published",
    title_text: "تم نشر درجة",
    body_text: "تم نشر نتيجة واجب التحقق",
    entity: "student_grade",
    entity_uuid: created.studentGradeId
  });
  if (notificationError || !notificationId) throw new Error(`notification: ${notificationError?.message ?? "missing id"}`);
  created.notificationId = String(notificationId);

  console.log("TEACHING_VERIFY_STAGE=rls-negative-checks");
  await expectRows(otherStudent.client, "announcements", "id", created.announcementId, "other student cannot see announcement", 0);
  await expectRows(otherStudent.client, "assignment_submissions", "id", created.submissionId, "other student cannot see submission", 0);
  await expectRows(otherStudent.client, "quiz_attempts", "id", created.attemptId, "other student cannot see attempt", 0);
  await expectRows(contentEditor.client, "quiz_answers", "attempt_id", created.attemptId, "content editor cannot see answers", 0);
  await expectRows(contentEditor.client, "student_grades", "id", created.studentGradeId, "content editor cannot see grades", 0);

  await expectNoMutation("other instructor can grade another section.", otherInstructor.client
    .from("assignment_submissions")
    .update({ grade: 1 })
    .eq("id", created.submissionId)
    .select("id"));
  await expectNoMutation("student can submit after due date when late submissions are disabled.", student.client
    .from("assignment_submissions")
    .insert({ assignment_id: created.expiredAssignmentId, student_id: created.studentId, body_text: "late", status: "submitted", submitted_at: iso(0) })
    .select("id"));
  await expectNoMutation("student can start expired quiz.", student.client
    .from("quiz_attempts")
    .insert({ quiz_id: created.expiredQuizId, student_id: created.studentId, attempt_number: 1 })
    .select("id"));
  await expectNoMutation("suspended user can submit assignment.", suspended.client
    .from("assignment_submissions")
    .insert({ assignment_id: created.assignmentId, student_id: created.suspendedStudentId, body_text: "blocked", status: "submitted", submitted_at: iso(0) })
    .select("id"));
  await expectNoMutation("suspended user can start quiz.", suspended.client
    .from("quiz_attempts")
    .insert({ quiz_id: created.quizId, student_id: created.suspendedStudentId, attempt_number: 1 })
    .select("id"));

  const { data: auditRows } = await service.from("audit_logs").select("id").eq("entity_id", created.attendanceId).eq("action", "attendance.update");
  if ((auditRows ?? []).length === 0) throw new Error("attendance audit log was not written.");

  console.log("TEACHING_OPERATIONS_VERIFICATION=passed");
}

async function cleanup() {
  await service.from("notification_deliveries").delete().eq("notification_id", created.notificationId);
  await service.from("notifications").delete().eq("id", created.notificationId);
  await service.from("grade_publications").delete().eq("section_id", created.sectionId);
  await service.from("final_grades").delete().eq("id", created.finalGradeId);
  await service.from("student_grades").delete().eq("id", created.studentGradeId);
  await service.from("grade_items").delete().eq("id", created.gradeItemId);
  await service.from("grade_categories").delete().eq("id", created.categoryId);
  await service.from("attendance_adjustment_requests").delete().eq("id", created.attendanceRequestId);
  await service.from("attendance_records").delete().eq("id", created.attendanceId);
  await service.from("meeting_attendance_links").delete().eq("meeting_id", created.meetingId);
  await service.from("class_sessions").delete().eq("id", created.classSessionId);
  await service.from("class_meetings").delete().eq("id", created.meetingId);
  await service.from("quiz_answers").delete().eq("attempt_id", created.attemptId);
  await service.from("quiz_attempts").delete().eq("id", created.attemptId);
  await service.from("quiz_questions").delete().eq("quiz_id", created.quizId);
  await service.from("quizzes").delete().in("id", [created.quizId, created.expiredQuizId].filter(Boolean));
  await service.from("question_options").delete().eq("question_id", created.mcQuestionId);
  await service.from("questions").delete().in("id", [created.mcQuestionId, created.essayQuestionId].filter(Boolean));
  await service.from("question_banks").delete().eq("id", created.bankId);
  await service.from("submission_feedback").delete().eq("id", created.feedbackId);
  await service.from("submission_files").delete().eq("submission_id", created.submissionId);
  await service.from("assignment_submissions").delete().in("assignment_id", [created.assignmentId, created.expiredAssignmentId].filter(Boolean));
  await service.from("assignment_resources").delete().eq("assignment_id", created.assignmentId);
  await service.from("assignments").delete().in("id", [created.assignmentId, created.expiredAssignmentId].filter(Boolean));
  await service.from("announcement_reads").delete().eq("announcement_id", created.announcementId);
  await service.from("announcement_targets").delete().eq("announcement_id", created.announcementId);
  await service.from("announcements").delete().eq("id", created.announcementId);
  await service.from("enrollments").delete().in("student_id", [created.studentId, created.otherStudentId, created.suspendedStudentId].filter(Boolean));
  await service.from("student_profiles").delete().in("id", [created.studentId, created.otherStudentId, created.suspendedStudentId].filter(Boolean));
  await service.from("course_instructors").delete().in("faculty_id", [created.facultyId, created.otherFacultyId].filter(Boolean));
  await service.from("faculty_profiles").delete().in("id", [created.facultyId, created.otherFacultyId].filter(Boolean));
  await service.from("course_sections").delete().in("id", [created.sectionId, created.otherSectionId].filter(Boolean));
  await service.from("cohorts").delete().eq("id", created.cohortId);
  await service.from("academic_terms").delete().eq("id", created.termId);
  await service.from("program_courses").delete().eq("program_id", created.programId);
  await service.from("courses").delete().eq("id", created.courseId);
  await service.from("program_levels").delete().eq("id", created.levelId);
  await service.from("academic_programs").delete().eq("id", created.programId);
  for (const userId of tempUsers) {
    await service.from("user_roles").delete().eq("user_id", userId);
    await service.from("profiles").delete().eq("id", userId);
    await service.auth.admin.deleteUser(userId);
  }
}

main()
  .finally(cleanup)
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
