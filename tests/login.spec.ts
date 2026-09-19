import { test, expect } from "@playwright/test";
import { uniqUserRegistration } from "../helpers/api-helpers";

test("login success", async ({ page, request }) => {
  /**
   * Сценарий: Успешный вход в созданную учетную запись
   *
   *
   * Что тестируется:
   * Вход в учетную запись при существующих данных
   *
   *   Входные данные:
   * Email: generated randomly
   * Password: '123123'
   *
   * Ожидаемый результат:
   * Редирект и отображение ссылки на профиль на странице
   *
   * Критичность:
   * Критический
   */
  const { response, password } = await uniqUserRegistration(request);
  const body: {
    email: string;
  } = await response.json();

  await page.goto("/login");

  await page.locator('input[type="email"]').fill(body.email);
  await page.locator('input[type="password"]').fill(password);
  await Promise.all([page.waitForURL("/"), page.click("button")]);
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: "Profile" })).toBeVisible();
});

test("should not allow login with unexisting profile", async ({ page }) => {
  /**
   * Сценарий: Вход в учетную запись по несуществующим данным
   *
   *
   * Что тестируется:
   * Вывод ошибки при попытке входа в несуществующую учетную запись
   *
   *   Входные данные:
   * Email: "notExsistingEmail@m"
   * Password: '123123'
   *
   * Ожидаемый результат:
   * Отображение ошибки на странице
   *
   * Критичность:
   * Критический
   */
  await page.goto("/login");

  await page.locator('input[type="email"]').fill("notExsistingEmail@m");
  await page.locator('input[type="password"]').fill("123123");
  await page.click("button");
  await expect(page.getByText("Login failed")).toBeVisible();
});
