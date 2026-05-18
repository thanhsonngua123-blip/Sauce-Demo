import { expect, type Locator, type Page } from '@playwright/test';
import { routes } from '@/test-data/routes';

export class RegisterPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createButton: Locator;
  readonly hcaptchaText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Create Account' });
    this.firstNameInput = page.locator('input[name="customer[first_name]"]');
    this.lastNameInput = page.locator('input[name="customer[last_name]"]');
    this.emailInput = page.locator('input[name="customer[email]"]');
    this.passwordInput = page.locator('input[name="customer[password]"]');
    this.createButton = page.locator('form[action$="/account"] input[type="submit"]');
    this.hcaptchaText = page.getByText('Protected by hCaptcha').first();
  }

  async goTo() {
    await this.page.goto(routes.register);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/account\/register/);
    await expect(this.heading).toBeVisible();
  }

  async expectRegisterFormVisible() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }

  async fillRegisterForm(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async expectRegisterFormValues(firstName: string, lastName: string, email: string, password: string) {
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.passwordInput).toHaveValue(password);
  }

  async submitRegisterForm() {
    await this.createButton.click();
  }

  async expectRegisterProtected() {
    await expect(this.page).toHaveURL(/account\/register/);
    await expect(this.hcaptchaText).toBeVisible();
  }
}
