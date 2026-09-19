import { test } from "../fixtures/auth";
import { expect, Page } from "@playwright/test";

test.describe("Profile tests", () => {
  let page: Page;

  test.beforeEach(async ({ authenticatedUser, browser }) => {
    const context = await browser.newContext({
      storageState: authenticatedUser.storageState,
    });

    page = await context.newPage();
  });
  test("should display auth email ", async ({ authenticatedUser }) => {
    /**
     * Сценарий: Переход на страницу профиля
     *
     * Предусловия:
     * Пользователь авторизован
     *
     * Что тестируется:
     * Отображение почты текущего пользователя
     *
     *
     * Ожидаемый результат:
     * Почта отображена на странице профиля
     *
     * Критичность:
     * Средний
     */
    const email = authenticatedUser.email;
    await page.goto("/profile");
    await expect(page).toHaveURL("/profile");

    await expect(page.getByText(email)).toBeVisible();
  });
});
