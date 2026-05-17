import { expect, type Locator, type Page } from '@playwright/test';
import { routes } from '@/test-data/routes';

export class LoginPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly forgotPasswordText: Locator;
  readonly resetPasswordHeading: Locator;
  readonly resetEmailInput: Locator;
  readonly loginForm: Locator;
  readonly signInButton: Locator;
  readonly hcaptchaText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Customer Login' });
    this.loginForm = page.locator('form[action$="/account/login"]');
    this.emailInput = page.getByLabel('Email Address');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = this.loginForm.locator('input[type="submit"]');
    this.forgotPasswordText = page.getByText('Forgot your password?');
    this.resetPasswordHeading = page.getByRole('heading', { name: 'Reset Password' });
    this.resetEmailInput = page.locator('#recover-email');
    this.hcaptchaText = page.getByText('Protected by hCaptcha').first();
  }

  async goTo() {
    await this.page.goto(routes.login);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/account\/login/);
    await expect(this.heading).toBeVisible();
  }

  async expectLoginFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillLoginForm(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  async expectEmailValue(email: string) {
    await expect(this.emailInput).toHaveValue(email);
  }

  async expectPasswordValue(password: string) {
    await expect(this.passwordInput).toHaveValue(password);
  }

  async clearEmail() {
    await this.emailInput.press('Control+A');
    await this.emailInput.press('Backspace');
  }

  async expectForgotPasswordVisible() {
    await expect(this.forgotPasswordText).toBeVisible();
    await this.forgotPasswordText.click();
    await expect(this.resetPasswordHeading).toBeVisible();
    await expect(this.resetEmailInput).toBeVisible();
  }

  async submitLoginForm() {
    await this.signInButton.click();
  }

  async expectInvalidLoginProtected() {
    await expect(this.page).toHaveURL(/account\/login/);
    await expect(this.hcaptchaText).toBeVisible();
  }
}
