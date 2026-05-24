import { expect, type Locator, type Page } from '@playwright/test';
import { routes } from '@/test-data/routes';

export class BlogPage {
  readonly page: Page;

  readonly firstPostLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstPostLink = page.getByRole('link', { name: 'First Post' });
  }

  async goTo() {
    await this.page.goto(routes.blog);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/blogs\/news/);
    await expect(this.firstPostLink).toBeVisible();
  }
}
