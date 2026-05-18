import { test, expect } from '@/fixtures/page.fixture';
import { mockCartFlow, mockCartPageWithItems, mockCatalogPage } from '@/tests/support/mocks';

test.describe('Cart page', () => {
  test('CART-002: cart rỗng hiển thị thông báo phù hợp', async ({ cartPage }) => {
    await cartPage.goTo();

    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();
  });

  test('CART-003: Continue Shopping điều hướng về catalog', async ({ cartPage, catalogPage }) => {
    await mockCatalogPage(cartPage.page);

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
    page,
  }) => {
    await mockCartFlow(page);

    await productPage.goTo('grey-jacket');
    await productPage.expectProductVisible('Grey jacket', '£55.00');

    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');
    await cartPage.expectQuantity('1');
  });

  test('CART-006: remove item khỏi cart rồi cart rỗng lại', async ({
    productPage,
    cartPage,
    page,
  }) => {
    await mockCartFlow(page);

    await productPage.goTo('grey-jacket');
    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');

    await cartPage.removeFirstItem();

    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();
  });

  test('CART-007: checkout button hiển thị khi cart có item', async ({
    productPage,
    cartPage,
    page,
  }) => {
    await mockCartFlow(page);

    await productPage.goTo('grey-jacket');
    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');
    await cartPage.expectCheckoutButtonVisible();
  });

  test('CART-008: click checkout điều hướng tới checkout page', async ({
    productPage,
    cartPage,
    page,
  }) => {
    await mockCartFlow(page);

    await productPage.goTo('grey-jacket');
    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();

    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout/);
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  });

  test('CART-009: cart hiển thị quantity nhiều hơn 1 và total đúng', async ({ cartPage, page }) => {
    await mockCartPageWithItems(page, [{ name: 'Grey jacket', price: '£55.00', quantity: 2 }]);

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');
    await cartPage.expectQuantity('2');
    await cartPage.expectTotal('£110.00');
  });

  test('CART-010: cart hiển thị nhiều sản phẩm và tổng tiền đúng', async ({ cartPage, page }) => {
    await mockCartPageWithItems(page, [
      { name: 'Grey jacket', price: '£55.00', quantity: 1 },
      { name: 'Noir jacket', price: '£60.00', quantity: 1 },
    ]);

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', '£55.00');
    await cartPage.expectProductVisible('Noir jacket', '£60.00');
    await cartPage.expectQuantities(['1', '1']);
    await cartPage.expectTotal('£115.00');
  });

  test('CART-011: update quantity trong cart cập nhật tổng tiền', async ({
    productPage,
    cartPage,
    page,
  }) => {
    await mockCartFlow(page);

    await productPage.goTo('grey-jacket');
    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectQuantity('1');
    await cartPage.expectTotal('£55.00');

    await cartPage.updateQuantity('2');

    await cartPage.expectLoaded();
    await cartPage.expectQuantity('2');
    await cartPage.expectTotal('£110.00');
  });
});
