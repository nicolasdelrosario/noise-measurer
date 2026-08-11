import { expect, test } from "@playwright/test";

test("the classroom view has no horizontal overflow at Hallmark widths", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 375, 414, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole("button", { name: /Iniciar monitor/ })).toBeVisible();
  }
});
