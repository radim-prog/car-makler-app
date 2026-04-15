import { expect, test } from "@playwright/test";

const inzerceUrl = process.env.PLAYWRIGHT_INZERCE_URL;
const shopUrl = process.env.PLAYWRIGHT_SHOP_URL;
const marketplaceUrl = process.env.PLAYWRIGHT_MARKETPLACE_URL;

test.describe("deployment smoke", () => {
  test("main web loads ecosystem pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toContainText(/CarMak|Ekosyst/i);
    await expect(page.getByRole("link", { name: /Pro bazary/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Marketplace/i }).first()).toBeVisible();

    for (const path of [
      "/gate",
      "/pro-bazary",
      "/pro-autickare",
      "/pro-investory",
      "/pro-makleri",
      "/shop",
      "/marketplace",
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBeLessThan(400);
      await expect(page.locator("h1, h2").first()).toBeVisible();
    }
  });

  test("subdomain front doors respond when configured", async ({ request }) => {
    const urls = [inzerceUrl, shopUrl, marketplaceUrl].filter(Boolean) as string[];
    test.skip(urls.length === 0, "Subdomain URLs are not configured for this run.");

    for (const url of urls) {
      const response = await request.get(url);
      expect(response.status(), url).toBeLessThan(400);
    }
  });
});
