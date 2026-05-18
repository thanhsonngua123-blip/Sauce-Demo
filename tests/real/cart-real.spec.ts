import { expect, test } from '@/fixtures/page.fixture';

test.describe('Real cart contract @real', () => {
  test.describe.configure({ retries: 1 });

  test('REAL-CART-001: add Grey jacket thật cập nhật cart page', async ({ productPage, cartPage }) => {
    await productPage.goTo('grey-jacket');
    await productPage.expectProductVisible('Grey jacket', '£55.00');

    await productPage.addToCart();

    await cartPage.goTo();

    await expect(cartPage.page.getByRole('heading', { name: 'My Cart' })).toBeVisible();
    await expect(cartPage.page.getByRole('heading', { name: /Grey jacket/i })).toBeVisible();
  });
});
