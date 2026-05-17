import { test, expect } from '@/fixtures/page.fixture';

test.describe('Cart page', () => {
  test('CART-001: cart page mở được', async ({ cartPage }) => {
    await cartPage.goTo();

    await cartPage.expectLoaded();
  });

  test('CART-002: cart rỗng hiển thị thông báo phù hợp', async ({ cartPage }) => {
    await cartPage.goTo();

    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();
  });

  test('CART-003: Continue Shopping điều hướng về catalog', async ({ cartPage, catalogPage }) => {
    await cartPage.goTo();

    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();

    await cartPage.continueShopping();

    await catalogPage.expectLoaded();
  });

  test('CART-004: header cart count ban đầu là 0', async ({ homePage, page }) => {
    await homePage.goTo();

    await expect(page.getByRole('link', { name: /My Cart\s*\(0\)/i })).toBeVisible();
  });

  test('CART-005: add Grey jacket vào cart và hiển thị đúng item', async ({
    productPage,
    cartPage,
  }) => {
    await productPage.goTo('grey-jacket');
    await productPage.expectProductVisible('Grey jacket', '£55.00');

    await productPage.addToCart();

    await cartPage.expectHeaderCartCount(1);

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');
    await cartPage.expectQuantity('1');
  });

  test('CART-006: remove item khỏi cart rồi cart rỗng lại', async ({ productPage, cartPage }) => {
    await productPage.goTo('grey-jacket');
    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');

    await cartPage.removeFirstItem();

    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();
    await cartPage.expectHeaderCartCount(0);
  });
});
