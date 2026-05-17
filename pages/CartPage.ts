import { expect, type Locator, type Page } from '@playwright/test';
import { routes } from '@/test-data/routes';

export class CartPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly emptyCartMessage: Locator;
  readonly continueShoppingLink: Locator;
  readonly removeItemLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'My Cart' });
    this.emptyCartMessage = page.getByText('It appears that your cart is currently empty!');
    this.continueShoppingLink = page.getByRole('link', { name: 'Continue Shopping' });
    this.removeItemLink = page.getByRole('link', { name: 'x' });
  }

  async goTo() {
    await this.page.goto(routes.cart);
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.heading).toBeVisible();
  }

  async expectCartEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async continueShopping() {
    await this.continueShoppingLink.click();
  }

  async expectHeaderCartCount(count: number) {
    await expect(this.page.getByRole('banner').getByRole('link', { name: `My Cart (${count})` })).toBeVisible();
  }

  async expectProductVisible(name: string, price: string) {
    await expect(this.page.getByRole('heading', { name: new RegExp(name, 'i') })).toBeVisible();
    await expect(this.page.getByText(price, { exact: true }).first()).toBeVisible();
  }

  async expectQuantity(quantity: string) {
    await expect(this.page.getByRole('textbox').first()).toHaveValue(quantity);
  }

  async removeFirstItem() {
    await this.removeItemLink.click();
  }
}
