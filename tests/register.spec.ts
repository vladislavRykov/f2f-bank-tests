import { test, expect } from "@playwright/test";
import { registerUser } from "../helpers/api-helpers";

test.describe("Register tests", () => {
  test("should allow register with valid fields", async ({ page }) => {
    /**
     * Сценарий: Успешная регистрация
     *
     * Что тестируется:
     * Регистрация пользователя с валидными данными
     *
     * Входные данные:
     * Name: user
     * Surname: user
     * Email: any@mail.com
     * Password: 123123
     *
     * Ожидаемый результат:
     * Пользователь успешно зарегистрирован
     * Появляется сообщение об успехе / редирект
     *
     * Критичность:
     * Критический
     */
    await page.goto("/register");
    const email = `e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@mail.com`;

    await page.locator('input[name="name"]').fill("user");
    await page.locator('input[name="surname"]').fill("user");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill("123123");

    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL("/login");
    await expect(
      page.getByText("Registration successful! Please log in"),
    ).toBeVisible();
  });

  test("should not allow to register with invalid email", async ({ page }) => {
    /**
     * Сценарий: Регистарация не проходит
     *
     *
     * Что тестируется:
     * Ввод невалидной почты в форму регистрации
     *
     * Входные данные:
     * Name: user
     * Surname: user
     * Email: em
     * Password: 123
     *
     * Ожидаемый результат:
     * Пользователь не зарегистрирован
     * Инпут становиться невалидным
     *
     * Критичность:
     * Критический
     */
    await page.goto("/register");

    await page.locator('input[name="name"]').fill("user");
    await page.locator('input[name="surname"]').fill("user");
    await page.locator('input[type="email"]').fill("em");
    await page.locator('input[type="password"]').fill("123");

    await page.getByRole("button", { name: "Register" }).click();
    const isValid = await page
      .locator('input[type="email"]')
      .evaluate((el) => (el as HTMLInputElement).checkValidity());

    expect(isValid).toBe(false);
    await expect(page).toHaveURL("/register");
  });

  test("should allow numbers in name or surname", async ({ page }) => {
    /**
     *Сценарий: Ввод цифр в поле имени
     *
     * Что тестируется:
     * Проверка валидации поля "Name"
     *
     * Входные данные:
     * Name: name123
     * Surname: surname123
     *
     * Ожидаемый результат:
     * (в текущей реализации) система позволяет ввод и регистрацию
     *
     * Критичность:
     * Средняя / Низкая (зависит от требований)
     */
    await page.goto("/register");
    const email = `e2e_${Date.now()}_${Math.random().toString(36).slice(2)}@mail.com`;
    await page.locator('input[name="name"]').fill("name123");
    await page.locator('input[name="surname"]').fill("surname123");
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill("123");

    await page.getByRole("button", { name: "Register" }).click();

    await expect(page).toHaveURL("/login");
    await expect(
      page.getByText("Registration successful! Please log in"),
    ).toBeVisible();
  });

  test("all fields should have required attribute", async ({ page }) => {
    /**
     * Сценарий: Регистарация не проходит
     *
     *
     * Что тестируется:
     * Отсутствие данных в форме регистрации при нажатии на кнопку submit
     *
     * Входные данные:
     * Name: ''
     * Surname: ''
     * Email: ''
     * Password: ''
     *
     * Ожидаемый результат:
     * Пользователь не зарегистрирован
     *
     * Критичность:
     * Критический
     */
    await page.goto("/register");
    await expect(page.locator('input[name="name"]')).toHaveAttribute(
      "required",
      "",
    );
    await expect(page.locator('input[name="surname"]')).toHaveAttribute(
      "required",
      "",
    );
    await expect(page.locator('input[type="email"]')).toHaveAttribute(
      "required",
      "",
    );
    await expect(page.locator('input[type="password"]')).toHaveAttribute(
      "required",
      "",
    );
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page).toHaveURL("/register");
  });
  test("should redirect unauth user from transactions", async ({ page }) => {
    /**
     * Сценарий: Переход неавторизированного на страницу транзакций
     *
     *
     * Что тестируется:
     * Редирект неавторизированного пользователя из страницы транзакций
     *
     * Ожидаемый результат:
     * Происходит редирект
     *
     * Критичность:
     * Критический
     */
    await page.goto("/transactions");
    await expect(page).toHaveURL("/login");
  });
});
