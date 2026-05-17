import { expect, type Locator, type Page } from '@playwright/test';
import { routes } from '@/test-data/routes';

export class AboutPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly pageContent: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageContent = page.locator('#page-content');
    this.heading = page.getByRole('heading', {
      name: 'About Us',
      level: 1,
    });
  }

  async goTo() {
    await this.page.goto(routes.about);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/pages\/about-us/);
    await expect(this.heading).toBeVisible();
  }

  async expectMainContentVisible() {
    await expect(this.pageContent).toBeVisible();
    await expect(this.heading).toBeVisible();
  }
}
