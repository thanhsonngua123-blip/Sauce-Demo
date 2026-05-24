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

  async clearRegisterForm() {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  async expectRegisterFormValues(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.passwordInput).toHaveValue(password);
  }

  async submitRegisterForm() {
    const navigation = this.page
      .waitForURL((url) => !/\/account\/register/.test(url.pathname), { timeout: 10_000 })
      .catch(() => null);
    await this.createButton.click();
    await navigation;
  }

  async accountCreated() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});

    const currentUrl = this.page.url();
    if (
      /\/account\/?$/.test(currentUrl) ||
      (/\/account/.test(currentUrl) && !/\/register/.test(currentUrl))
    ) {
      return true;
    }

    const accountHeadingVisible = await this.page
      .getByRole('heading', { name: 'Account Details and Order History' })
      .isVisible({ timeout: 1_000 })
      .catch(() => false);

    if (accountHeadingVisible) {
      return true;
    }

    const accountLinkVisible = await this.page
      .getByRole('banner')
      .getByRole('link', { name: 'MyAccount' })
      .isVisible({ timeout: 1_000 })
      .catch(() => false);

    const logoutLinkVisible = await this.page
      .getByRole('banner')
      .getByRole('link', { name: 'Log Out' })
      .isVisible({ timeout: 1_000 })
      .catch(() => false);

    if (accountLinkVisible && logoutLinkVisible) {
      return true;
    }

    return false;
  }

  async expectRegisterProtected() {
    await expect(this.page).toHaveURL(/account\/register/);
    await expect(this.hcaptchaText).toBeVisible();
  }

  currentUrl() {
    return this.page.url();
  }
}
