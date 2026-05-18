import { expect, test } from '@/fixtures/page.fixture';

test.describe('Real cart contract @real', () => {
  test.describe.configure({ retries: 1 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/cart/clear');
  });

  test.afterEach(async ({ page }) => {
    await page.goto('/cart/clear');
  });

  test('REAL-CART-001: cart rỗng thật hiển thị đúng và Continue Shopping về catalog', async ({
    homePage,
    cartPage,
    catalogPage,
    page,
  }) => {
    await homePage.goTo();
    await expect(page.getByRole('link', { name: /My Cart\s*\(0\)/i })).toBeVisible();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();

    await cartPage.continueShopping();
    await catalogPage.expectLoaded();
  });

  test('REAL-CART-002: add, update quantity, remove item thật trên cart page', async ({
    productPage,
    cartPage,
    page,
  }) => {
    await productPage.goTo('grey-jacket');
    await productPage.expectProductVisible('Grey jacket', '£55.00');

    await productPage.addToCart();

    await cartPage.goTo();
    await expect(page.getByRole('heading', { name: 'My Cart' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Grey jacket/i })).toBeVisible();

    const quantityInput = page.locator('input[name="updates[]"]:visible').first();

    await expect(quantityInput).toHaveValue('1');
    await expect(page.getByText('Total £55.00')).toBeVisible();

    await quantityInput.fill('2');
    await page.locator('input[name="update"]:visible').click();

    await expect(quantityInput).toHaveValue('2');
    await expect(page.getByText('Total £110.00')).toBeVisible();

    await page.getByRole('link', { name: 'x' }).click();

    await expect(page.getByText('It appears that your cart is currently empty!')).toBeVisible();
  });
});
