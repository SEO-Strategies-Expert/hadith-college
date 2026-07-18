import { expect, test } from "@playwright/test";

test("homepage and dashboard routes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "كلية الحديث وعلومه" })).toBeVisible();

  await page.goto("/dashboard/admin");
  await expect(page.getByRole("heading", { name: "لوحة مدير الكلية" })).toBeVisible();
});
