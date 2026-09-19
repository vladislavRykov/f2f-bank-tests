import { test as setup } from "@playwright/test";

setup("auth setup", async ({ page }) => {
  await page.goto("/login");

  await page.fill("#email", "test@mail.com");
  await page.fill("#password", "123456");
  await page.click('button[type="submit"]');

  await page.context().storageState({ path: "storageState.json" });
});
