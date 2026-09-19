import { test } from "../fixtures/auth";
import { expect, Page } from "@playwright/test";

test.describe("Balance tests", () => {
  let page: Page;

  test.beforeEach(async ({ authenticatedUser, browser }) => {
    const context = await browser.newContext({
      storageState: authenticatedUser.storageState,
    });

    page = await context.newPage();
  });
  test("should add to balance", async () => {
    /**
     * Сценарий: Успешное пополнение баланса
     *
     *
     * Что тестируется:
     * Пополнение баланса при вводе корректных данных
     *
     * Предусловия:
     * Пользователь авторизован
     *
     * Входные данные:
     * sum: "3000"
     *
     * Ожидаемый результат:
     * Отображение баланса на странице
     *
     * Критичность:
     * Критический
     */
    await page.goto("/transactions");
    await expect(page).toHaveURL("/transactions");

    await page.getByRole("button", { name: "Add balance" }).click();
    await page.getByPlaceholder("Enter sum").fill("3000");

    await page.locator("button.confirm-btn", { hasText: "Add" }).click();
    await expect(page.getByRole("heading", { name: "Balance" })).toHaveText(
      "Balance: 3000",
    );
    await expect(page.locator("tr").getByText("3000")).toBeVisible();
  });
  test("should not add to balance value 0 or less", async () => {
    /**
     * Сценарий: Ввод в поле пополнения баланса 0 или отрицательного числа
     *
     * Что тестируется:
     * Валидация поля ввода баланса
     *
     * Предусловия:
     * Пользователь авторизован
     *
     * Входные данные:
     * sum: "-100", "0"
     *
     * Ожидаемый результат:
     * При sum = 0: Не появляется запись о внесенной сумме
     * При sum = -100: Баланс не изменяется с 0 на -100
     *
     * Критичность:
     * Критический
     */
    await page.goto("/transactions");
    await expect(page).toHaveURL("/transactions");

    await page.getByRole("button", { name: "Add balance" }).click();

    const input = page.getByPlaceholder("Enter sum");
    const confirm_btn = page.locator("button.confirm-btn", { hasText: "Add" });

    await input.fill("-100");
    await confirm_btn.click();
    await expect(
      page.locator("h2.header__link", { hasText: "Balance" }),
    ).toHaveText("Balance: 0");
    await expect(page.locator("tr").getByText("-100")).not.toBeVisible();

    await input.fill("0");
    await confirm_btn.click();

    await expect(page.locator("tr").getByText("0")).not.toBeVisible();
  });
});
