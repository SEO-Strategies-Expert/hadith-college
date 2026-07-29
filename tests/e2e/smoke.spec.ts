import { expect, test } from "@playwright/test";

test("homepage and dashboard routes render", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "من الرواية إلى التحقيق… مسار علمي يصنع الباحث المتقن" })
  ).toBeVisible();

  await page.goto("/dashboard/admin");
  await expect(
    page
      .getByRole("heading", { name: "لوحة مدير الكلية" })
      .or(page.getByRole("heading", { name: "تسجيل الدخول" }))
  ).toBeVisible();
});
