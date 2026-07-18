export const roles = [
  "super_admin",
  "college_admin",
  "academic_admin",
  "content_editor",
  "admissions_officer",
  "finance_officer",
  "librarian",
  "instructor",
  "teaching_assistant",
  "reviewer",
  "student"
] as const;

export type Role = (typeof roles)[number];

const adminRoles: Role[] = ["super_admin", "college_admin"];

export function isAdminRole(role: Role) {
  return adminRoles.includes(role);
}

export function canAccessDashboard(role: Role, dashboard: "admin" | "faculty" | "student") {
  if (dashboard === "admin") {
    return ["super_admin", "college_admin", "academic_admin", "content_editor", "admissions_officer", "finance_officer", "librarian"].includes(role);
  }
  if (dashboard === "faculty") {
    return ["instructor", "teaching_assistant", "reviewer", "academic_admin", "college_admin", "super_admin"].includes(role);
  }
  return role === "student" || isAdminRole(role);
}
