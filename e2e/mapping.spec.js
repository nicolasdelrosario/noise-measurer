import { expect, test } from "@playwright/test";

test("opens cartography with an honest empty state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "02 / Cartografía" }).click();
  await expect(page.getByRole("heading", { name: "Leer el espacio." })).toBeVisible();
  await expect(page.getByText("Todavía no existen mediciones").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Iniciar medición/ })).toBeVisible();
  const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
  expect(decodeURIComponent(favicon)).toContain("😀");
  for (const zoneName of ["Tópico", "Jardín / áreas verdes"]) {
    const zone = page.locator(`.map-zone[data-zone="${zoneName}"]`);
    const label = zone.getByText(zoneName, { exact: true });
    const empty = zone.getByText("sin datos", { exact: true });
    const [labelBox, emptyBox] = await Promise.all([label.boundingBox(), empty.boundingBox()]);
    expect(labelBox.y + labelBox.height).toBeLessThanOrEqual(emptyBox.y);
  }
});
