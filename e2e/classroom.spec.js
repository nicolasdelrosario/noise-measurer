import { expect, test } from "@playwright/test";

test.describe("Modo aula", () => {
  test("opens in the classroom monitor", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "El aula, en claro." })).toBeVisible();
    await expect(page.getByRole("button", { name: /Iniciar monitor/ })).toBeVisible();
    await expect(page.getByLabel("Sensibilidad visual")).toHaveValue("50");
  });

  test("persists visual sensitivity", async ({ page }) => {
    await page.goto("/");
    const sensitivity = page.getByLabel("Sensibilidad visual");
    await sensitivity.focus();
    for (let step = 0; step < 30; step += 1) await sensitivity.press("ArrowRight");
    await expect(sensitivity).toHaveValue("80");
    await expect.poll(() => page.evaluate(() => localStorage.getItem("school-noise-sensitivity"))).toBe("80");
    await page.reload();
    await expect(page.getByLabel("Sensibilidad visual")).toHaveValue("80");
  });

  test("shows monitor details in fullscreen when supported", async ({ page }, testInfo) => {
    await page.goto("/");
    const monitor = page.locator(".monitor-card");
    const fullscreenButton = page.getByRole("button", { name: "Pantalla completa" });
    if (await monitor.evaluate((element) => typeof element.requestFullscreen !== "function")) {
      await expect(fullscreenButton).toBeVisible();
      return;
    }
    await fullscreenButton.click();
    await expect(monitor).toHaveCSS("background-color", "rgb(22, 27, 22)");
    await expect(monitor.getByText(/Límite 70 dB/)).toBeVisible();
    await expect(monitor.getByText(/Sensibilidad 50/)).toBeVisible();
    const exit = monitor.getByRole("button", { name: "Salir" });
    if (testInfo.project.name === "mobile") {
      const viewport = page.viewportSize();
      const [statusBox, metricsBox, exitBox] = await Promise.all([
        monitor.locator(".fullscreen-status").boundingBox(),
        monitor.locator(".fullscreen-metrics").boundingBox(),
        exit.boundingBox(),
      ]);
      expect(statusBox.x).toBeGreaterThanOrEqual(0);
      expect(statusBox.x + statusBox.width).toBeLessThanOrEqual(viewport.width);
      expect(exitBox.x + exitBox.width).toBeLessThanOrEqual(viewport.width);
      expect(exitBox.y + exitBox.height).toBeLessThanOrEqual(viewport.height);
      expect(exitBox.x).toBeGreaterThanOrEqual(metricsBox.x + metricsBox.width - 1);
    }
    await exit.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Pantalla completa" })).toBeVisible();
  });

  test("keeps the physics canvas fitted to the scene", async ({ page }) => {
    await page.goto("/");
    const scene = page.locator(".face-field");
    const canvas = page.locator(".monitor-canvas");
    await expect.poll(async () => {
      const [sceneBox, canvasBox] = await Promise.all([scene.boundingBox(), canvas.boundingBox()]);
      return Boolean(sceneBox && canvasBox && Math.abs(sceneBox.width - canvasBox.width) < 1 && Math.abs(sceneBox.height - canvasBox.height) < 1);
    }).toBe(true);
    const fullscreenButton = page.getByRole("button", { name: "Pantalla completa" });
    if (await page.locator(".monitor-card").evaluate((element) => typeof element.requestFullscreen !== "function")) return;
    await fullscreenButton.click();
    const viewport = page.viewportSize();
    await expect.poll(async () => {
      const [sceneBox, canvasBox] = await Promise.all([scene.boundingBox(), canvas.boundingBox()]);
      return Boolean(sceneBox && canvasBox && sceneBox.width >= viewport.width - 2 && sceneBox.height >= viewport.height - 2 && Math.abs(sceneBox.width - canvasBox.width) < 1 && Math.abs(sceneBox.height - canvasBox.height) < 1);
    }).toBe(true);
    await page.keyboard.press("Escape");
  });

  test("fills the scene with Bouncy Balls-style emojis", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator(".monitor-canvas");
    await expect.poll(async () => {
      const result = await canvas.evaluate((element) => {
        const { width, height } = element.getBoundingClientRect();
        const square = Math.sqrt(width * height);
        const maximum = Math.max(50, Math.min(250, Math.ceil(square / 120) * 25 - 25));
        const expected = Math.ceil(Math.max(25, Math.min(square < 800 ? 36 : square / 16, maximum)));
        const count = Number(element.dataset.emojiCount);
        return count > 0 && count <= expected;
      });
      return result;
    }).toBe(true);
  });
});
