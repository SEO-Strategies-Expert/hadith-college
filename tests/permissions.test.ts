import { describe, expect, it } from "vitest";
import { canAccessDashboard, isAdminRole } from "@/lib/permissions/roles";

describe("role helpers", () => {
  it("recognizes top-level admin roles", () => {
    expect(isAdminRole("super_admin")).toBe(true);
    expect(isAdminRole("college_admin")).toBe(true);
    expect(isAdminRole("student")).toBe(false);
  });

  it("does not allow students into faculty or admin dashboards", () => {
    expect(canAccessDashboard("student", "student")).toBe(true);
    expect(canAccessDashboard("student", "faculty")).toBe(false);
    expect(canAccessDashboard("student", "admin")).toBe(false);
  });
});
