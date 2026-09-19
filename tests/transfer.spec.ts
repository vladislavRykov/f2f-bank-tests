import { test } from "../fixtures/auth";
import { expect, Page } from "@playwright/test";

// Номер телефона: должен начинаться с +, всего 10–15 цифр (пробелы, дефисы и скобки допускаются). Пример: +7 999 123-45-67
// Сумма перевода: должна быть больше нуля
// Баланс: должен быть достаточным для совершения перевода

const fillTransferForm = async (
  page: Page,
  {
    phone,
    amount,
    purpose,
  }: { phone: string; amount: string; purpose: string },
) => {
  await page.locator('input[name="phone"]').fill(phone);
  await page.locator('input[name="amount"]').fill(amount);
  await page.locator('input[name="purpose"]').fill(purpose);
};

test.describe("Transfer tests", () => {
  let page: Page;

  test.beforeEach(async ({ authenticatedUser, browser }) => {
    const context = await browser.newContext({
      storageState: authenticatedUser.storageState,
    });

    page = await context.newPage();

    await page.goto("/transactions");

    await page.getByRole("button", { name: "Add balance" }).click();
    await page.getByPlaceholder("Enter sum").fill("3000");
    await page.locator("button.confirm-btn", { hasText: "Add" }).click();

    await page.goto("/");
    await page.waitForURL("/");
  });
  test("should allow transfer", async () => {
    /**
     * Сценарий: Успешный перевод
     *
     * Что тестируется:
     * Перевод средств по валидным данным
     *
     * Предусловия:
     * Пользователь авторизован
     * Баланс пользователя = 3000
     *
     * Входные данные:
     * phone: "+7 111 111 11 11",
     * amount: "1000",
     * purpose: "gift",
     *
     * Ожидаемый результат:
     * Перевод прошел, отображение кнопки для нового перевода
     *
     * Критичность:
     * Критический
     */
    await fillTransferForm(page, {
      phone: "+7 111 111 11 11",
      amount: "1000",
      purpose: "gift",
    });

    await page.getByRole("button", { name: "Send" }).click();
    await expect(
      page.getByRole("button", { name: "New transfer" }),
    ).toBeVisible();
  });
  test("should not allow transfer with negative amount", async () => {
    /**
     * Сценарий: Перевод с отрицательным значением суммы
     *
     * Что тестируется:
     * Работа валидации поля amount в форме
     *
     * Предусловия:
     * Пользователь авторизован
     * Баланс пользователя = 3000
     *
     * Входные данные:
     * phone: "+7 111 111 11 11",
     * amount: "-1000",
     * purpose: "gift",
     *
     * Ожидаемый результат:
     * Перевод не прошел, отображение сообщения об ошибке
     *
     * Критичность:
     * Критический
     */
    await fillTransferForm(page, {
      phone: "+7 111 111 11 11",
      amount: "-1000",
      purpose: "gift",
    });

    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Amount must be greater than zero"),
    ).toBeVisible();
  });
  test("should not allow transfer when balance is lower then amount", async () => {
    /**
     * Сценарий: Перевод с суммы большей, чем есть на балансе
     *
     * Что тестируется:
     * Работа валидации поля amount в форме
     *
     * Предусловия:
     * Пользователь авторизован
     * Баланс пользователя = 3000
     *
     * Входные данные:
     * phone: "+7 111 111 11 11",
     * amount: "4000",
     * purpose: "gift",
     *
     * Ожидаемый результат:
     * Перевод не прошел, отображение сообщения об ошибке
     *
     * Критичность:
     * Критический
     */
    await fillTransferForm(page, {
      phone: "+7 111 111 11 11",
      amount: "4000",
      purpose: "gift",
    });

    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Transfer failed. Check your balance"),
    ).toBeVisible();
  });
  test("transfer phone number should be valid", async () => {
    /**
     * Сценарий: Перевод с невалидным номером телефона
     *
     * Что тестируется:
     * Работа валидации поля phone в форме
     *
     * Предусловия:
     * Пользователь авторизован
     * Баланс пользователя = 3000
     *
     * Входные данные:
     * phone: "-7 111 111 11 11","+7 111 111 11 11222222222",
     * amount: "4000",
     * purpose: "gift",
     *
     * Ожидаемый результат:
     * Перевод не прошел, отображение сообщения об ошибке
     *
     * Критичность:
     * Критический
     */
    await fillTransferForm(page, {
      phone: "-7 111 111 11 11",
      amount: "4000",
      purpose: "gift",
    });

    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Must start with +")).toBeVisible();

    await page.locator('input[name="phone"]').fill("+7 111 111 11 11222222222");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByText("Phone must contain 10–15 digits"),
    ).toBeVisible();
  });
});
