import { expect, test } from "@playwright/test";

const SITE_URL = "https://anai-del-rosario.nicolasdelrosario.com/";

test("publishes complete search and social metadata", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Ruido de aula | Monitor escolar de ruido");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Monitor visual de ruido para aulas/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", SITE_URL);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", SITE_URL);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${SITE_URL}app-preview.png`);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1741");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "908");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

  const structuredData = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(structuredData).toMatchObject({ "@type": "WebApplication", name: "Ruido de aula", url: SITE_URL, inLanguage: "es" });

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(`${SITE_URL}sitemap.xml`);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(`<loc>${SITE_URL}</loc>`);
  const socialCard = await request.get("/app-preview.png");
  expect(socialCard.ok()).toBe(true);
  expect(socialCard.headers()["content-type"]).toContain("image/png");
  expect((await socialCard.body()).byteLength).toBeGreaterThan(10_000);
  const dimensions = await page.evaluate(() => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = reject;
    image.src = "/app-preview.png";
  }));
  expect(dimensions).toEqual({ width: 1741, height: 908 });
});
