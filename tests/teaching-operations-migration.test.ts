import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/20260718002000_teaching_operations_mvp.sql"), "utf8");

describe("teaching operations migration", () => {
  it("creates the requested teaching operation tables", () => {
    [
      "announcements",
      "announcement_targets",
      "announcement_reads",
      "assignments",
      "assignment_resources",
      "assignment_submissions",
      "submission_files",
      "submission_feedback",
      "quizzes",
      "question_banks",
      "questions",
      "question_options",
      "quiz_questions",
      "quiz_attempts",
      "quiz_answers",
      "class_sessions",
      "attendance_records",
      "attendance_adjustment_requests",
      "grade_categories",
      "grade_items",
      "student_grades",
      "final_grades",
      "grade_publications",
      "class_meetings",
      "meeting_occurrences",
      "meeting_attendance_links",
      "notifications",
      "notification_preferences",
      "notification_deliveries"
    ].forEach((table) => {
      expect(migration).toContain(`public.${table}`);
    });
  });

  it("includes RLS helpers for targeted access and submission windows", () => {
    [
      "public.can_read_announcement",
      "public.can_access_assignment",
      "public.can_submit_assignment",
      "public.can_access_quiz",
      "public.can_start_quiz_attempt",
      "public.autograde_quiz_attempt",
      "a.due_at >= now() or a.allow_late_submissions"
    ].forEach((needle) => {
      expect(migration).toContain(needle);
    });
  });

  it("creates policies for student, instructor, admin and content-editor boundaries", () => {
    [
      "assignments_manage_instructor",
      "assignment_submissions_select_owner_or_instructor",
      "quiz_attempts_insert_student",
      "student_grades_select_published_or_staff",
      "final_grades_manage_instructor",
      "notifications_select_self_or_admin",
      "assignment_submissions_storage_upload"
    ].forEach((needle) => {
      expect(migration).toContain(needle);
    });
  });
});
