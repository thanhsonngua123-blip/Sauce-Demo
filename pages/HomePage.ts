import { expect, Locator, Page } from '@playwright/test';
import { routes } from '@/test-data/routes';

export class HomePage {
  readonly page: Page;
  readonly slogan: Locator;
  readonly catalogLink: Locator;
  readonly loginLink: Locator;
  readonly searchLink: Locator;
  readonly aboutUsLink: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.slogan = page.getByText('Just a demo site showing off what Sauce can do.');
    this.catalogLink = page.getByRole('link', { name: 'Catalog' });
    this.loginLink = page.getByRole('banner').getByRole('link', { name: 'Log In' });
    this.searchLink = page.getByRole('banner').getByRole('link', { name: 'Search' });
    this.aboutUsLink = page.getByRole('link', { name: 'About us' }).first();
    this.cartLink = page.getByRole('banner').getByRole('link', { name: 'Check Out' });
  }

  async goTo() {
    await this.page.goto(routes.home);
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/Sauce Demo/);
    await expect(this.slogan).toBeVisible();
  }

  async expectMainNavigationVisible() {
    await expect(this.catalogLink).toBeVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.searchLink).toBeVisible();
    await expect(this.aboutUsLink).toBeVisible();
    await expect(this.cartLink).toBeVisible();
  }

  async expectFeaturedProductVisible(productName: string | RegExp) {
    await expect(this.page.getByRole('link', { name: productName })).toBeVisible();
  }

  async goToCatalog() {
    await this.catalogLink.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async goToSearch() {
    await this.searchLink.click();
  }

  async goToAboutUs() {
    await this.aboutUsLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
