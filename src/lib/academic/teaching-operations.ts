import "server-only";
import { getAdminClientOrNull, getFacultyCoursesForUser, getStudentDashboard } from "@/lib/academic/academic-core";

type CountResult = { count: number | null };

export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  priority: string;
  published_at: string | null;
  expires_at: string | null;
  status: string;
  is_pinned: boolean;
  course_sections?: { section_code: string; courses?: { code: string; name_ar: string } | null } | null;
};

export type CalendarMeetingRow = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  timezone: string;
  meeting_mode: string;
  location: string | null;
  online_meeting_url: string | null;
  recording_url: string | null;
  status: string;
  course_sections?: { section_code: string; courses?: { code: string; name_ar: string } | null } | null;
};

export type FacultyTeachingDashboard = {
  todayMeetings: CalendarMeetingRow[];
  gradingQueue: number;
  activeQuizzes: number;
  attendanceRequests: number;
  sectionCount: number;
  enrolledStudents: number;
  announcements: AnnouncementRow[];
  atRiskStudents: number;
};

export type StudentTeachingDashboard = {
  todayMeetings: CalendarMeetingRow[];
  upcomingAssignments: Array<{ id: string; title: string; due_at: string | null; course_sections?: { section_code: string; courses?: { code: string; name_ar: string } | null } | null }>;
  availableQuizzes: Array<{ id: string; title: string; available_until: string | null; course_sections?: { section_code: string; courses?: { code: string; name_ar: string } | null } | null }>;
  announcements: AnnouncementRow[];
  attendancePercentage: number | null;
  publishedGradeAverage: number | null;
  notifications: Array<{ id: string; title: string; body: string | null; created_at: string }>;
};

function dayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

function ids(rows: Array<{ id: string }>) {
  return rows.map((row) => row.id);
}

async function exactCount(query: PromiseLike<CountResult>) {
  const { count } = await query;
  return count ?? 0;
}

export async function listAdminAnnouncements() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("announcements")
    .select("*, course_sections(section_code, courses(code, name_ar))")
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as AnnouncementRow[];
}

export async function listFacultyAnnouncements(userId: string) {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const sections = await getFacultyCoursesForUser(userId);
  const sectionIds = ids(sections);
  if (sectionIds.length === 0) return [];
  const { data } = await admin
    .from("announcements")
    .select("*, course_sections(section_code, courses(code, name_ar))")
    .in("section_id", sectionIds)
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as AnnouncementRow[];
}

export async function listStudentAnnouncements(userId: string) {
  const admin = await getAdminClientOrNull();
  const dashboard = await getStudentDashboard(userId);
  const sectionIds = (dashboard?.enrollments ?? []).map((enrollment) => enrollment.course_sections?.id).filter(Boolean) as string[];
  if (!admin || sectionIds.length === 0) return [];
  const { data } = await admin
    .from("announcements")
    .select("*, course_sections(section_code, courses(code, name_ar)), announcement_targets(target_type, target_id)")
    .eq("status", "published")
    .or(`target_type.eq.all,target_id.in.(${sectionIds.join(",")})`, { foreignTable: "announcement_targets" })
    .order("is_pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as AnnouncementRow[];
}

export async function listAdminCalendar() {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const { data } = await admin
    .from("class_meetings")
    .select("*, course_sections(section_code, courses(code, name_ar))")
    .order("starts_at", { ascending: true })
    .limit(100);
  return (data ?? []) as unknown as CalendarMeetingRow[];
}

export async function listFacultyCalendar(userId: string) {
  const admin = await getAdminClientOrNull();
  if (!admin) return [];
  const sections = await getFacultyCoursesForUser(userId);
  const sectionIds = ids(sections);
  if (sectionIds.length === 0) return [];
  const { data } = await admin
    .from("class_meetings")
    .select("*, course_sections(section_code, courses(code, name_ar))")
    .in("section_id", sectionIds)
    .order("starts_at", { ascending: true })
    .limit(100);
  return (data ?? []) as unknown as CalendarMeetingRow[];
}

export async function listStudentCalendar(userId: string) {
  const admin = await getAdminClientOrNull();
  const dashboard = await getStudentDashboard(userId);
  const sectionIds = (dashboard?.enrollments ?? []).map((enrollment) => enrollment.course_sections?.id).filter(Boolean) as string[];
  if (!admin || sectionIds.length === 0) return [];
  const { data } = await admin
    .from("class_meetings")
    .select("*, course_sections(section_code, courses(code, name_ar))")
    .in("section_id", sectionIds)
    .eq("status", "published")
    .order("starts_at", { ascending: true })
    .limit(100);
  return (data ?? []) as unknown as CalendarMeetingRow[];
}

export async function getFacultyTeachingDashboard(userId: string): Promise<FacultyTeachingDashboard> {
  const admin = await getAdminClientOrNull();
  const sections = await getFacultyCoursesForUser(userId);
  const sectionIds = ids(sections);
  const { start, end } = dayRange();
  if (!admin || sectionIds.length === 0) {
    return { todayMeetings: [], gradingQueue: 0, activeQuizzes: 0, attendanceRequests: 0, sectionCount: 0, enrolledStudents: 0, announcements: [], atRiskStudents: 0 };
  }

  const [meetings, gradingQueue, activeQuizzes, attendanceRequests, announcements, enrollments, absentRecords, lowGrades] = await Promise.all([
    admin.from("class_meetings").select("*, course_sections(section_code, courses(code, name_ar))").in("section_id", sectionIds).gte("starts_at", start).lt("starts_at", end).order("starts_at"),
    exactCount(admin.from("assignment_submissions").select("id, assignments!inner(section_id)", { count: "exact", head: true }).in("assignments.section_id", sectionIds).eq("status", "submitted")),
    exactCount(admin.from("quizzes").select("id", { count: "exact", head: true }).in("section_id", sectionIds).eq("status", "published")),
    exactCount(admin.from("attendance_adjustment_requests").select("id, attendance_records!inner(class_sessions!inner(section_id))", { count: "exact", head: true }).in("attendance_records.class_sessions.section_id", sectionIds).eq("status", "pending")),
    admin.from("announcements").select("*, course_sections(section_code, courses(code, name_ar))").in("section_id", sectionIds).order("published_at", { ascending: false }).limit(5),
    admin.from("enrollments").select("student_id").in("section_id", sectionIds).eq("status", "active"),
    admin.from("attendance_records").select("student_id, class_sessions!inner(section_id)").in("class_sessions.section_id", sectionIds).in("status", ["absent", "late"]),
    admin.from("student_grades").select("student_id, score, grade_items!inner(points, grade_categories!inner(section_id))").in("grade_items.grade_categories.section_id", sectionIds).lt("score", 60)
  ]);

  const atRisk = new Set<string>();
  for (const row of absentRecords.data ?? []) atRisk.add(String((row as { student_id: string }).student_id));
  for (const row of lowGrades.data ?? []) atRisk.add(String((row as { student_id: string }).student_id));

  return {
    todayMeetings: (meetings.data ?? []) as unknown as CalendarMeetingRow[],
    gradingQueue,
    activeQuizzes,
    attendanceRequests,
    sectionCount: sectionIds.length,
    enrolledStudents: new Set((enrollments.data ?? []).map((row) => String((row as { student_id: string }).student_id))).size,
    announcements: (announcements.data ?? []) as unknown as AnnouncementRow[],
    atRiskStudents: atRisk.size
  };
}

export async function getStudentTeachingDashboard(userId: string): Promise<StudentTeachingDashboard> {
  const admin = await getAdminClientOrNull();
  const dashboard = await getStudentDashboard(userId);
  const sectionIds = (dashboard?.enrollments ?? []).map((enrollment) => enrollment.course_sections?.id).filter(Boolean) as string[];
  const studentId = dashboard?.student?.id;
  const { start, end } = dayRange();
  if (!admin || !studentId || sectionIds.length === 0) {
    return { todayMeetings: [], upcomingAssignments: [], availableQuizzes: [], announcements: [], attendancePercentage: null, publishedGradeAverage: null, notifications: [] };
  }

  const [meetings, assignments, quizzes, announcements, attendance, grades, notifications] = await Promise.all([
    admin.from("class_meetings").select("*, course_sections(section_code, courses(code, name_ar))").in("section_id", sectionIds).gte("starts_at", start).lt("starts_at", end).eq("status", "published").order("starts_at"),
    admin.from("assignments").select("id, title, due_at, course_sections(section_code, courses(code, name_ar))").in("section_id", sectionIds).eq("status", "published").gte("due_at", new Date().toISOString()).order("due_at").limit(8),
    admin.from("quizzes").select("id, title, available_until, course_sections(section_code, courses(code, name_ar))").in("section_id", sectionIds).eq("status", "published").gte("available_until", new Date().toISOString()).order("available_until").limit(8),
    admin.from("announcements").select("*, course_sections(section_code, courses(code, name_ar))").in("section_id", sectionIds).eq("status", "published").order("published_at", { ascending: false }).limit(8),
    admin.from("attendance_records").select("status, class_sessions!inner(section_id)").eq("student_id", studentId).in("class_sessions.section_id", sectionIds),
    admin.from("student_grades").select("score").eq("student_id", studentId).eq("is_published", true),
    admin.from("notifications").select("id, title, body, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5)
  ]);

  const attendanceRows = (attendance.data ?? []) as Array<{ status: string }>;
  const attended = attendanceRows.filter((row) => row.status === "present" || row.status === "late" || row.status === "excused").length;
  const gradeRows = (grades.data ?? []) as Array<{ score: number | null }>;
  const scores = gradeRows.map((row) => Number(row.score)).filter((score) => Number.isFinite(score));

  return {
    todayMeetings: (meetings.data ?? []) as unknown as CalendarMeetingRow[],
    upcomingAssignments: (assignments.data ?? []) as StudentTeachingDashboard["upcomingAssignments"],
    availableQuizzes: (quizzes.data ?? []) as StudentTeachingDashboard["availableQuizzes"],
    announcements: (announcements.data ?? []) as unknown as AnnouncementRow[],
    attendancePercentage: attendanceRows.length ? Math.round((attended / attendanceRows.length) * 100) : null,
    publishedGradeAverage: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null,
    notifications: (notifications.data ?? []) as StudentTeachingDashboard["notifications"]
  };
}
