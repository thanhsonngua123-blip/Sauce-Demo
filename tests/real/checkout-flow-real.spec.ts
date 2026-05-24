import { expect, test } from '@/fixtures/page.fixture';

test.describe('Luồng thanh toán đầu cuối @real @e2e @mutation', () => {
  test('REAL-CHECKOUT-001: người dùng có thể thêm sản phẩm vào giỏ và đi đến trang thanh toán', async ({
    homePage,
    catalogPage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    await homePage.goTo();
    await homePage.expectLoaded();
    await homePage.goToCatalog();

    await catalogPage.expectLoaded();
    await catalogPage.openProduct(/Grey jacket/i);
    await productPage.expectProductVisible('Grey jacket', 'Â£55.00');
    await productPage.addToCart();

    await cartPage.goTo();
    await cartPage.expectLoaded();
    await cartPage.expectProductVisible('Grey jacket', 'Â£55.00');
    await cartPage.checkout();

    await checkoutPage.expectLoaded();

    await checkoutPage.fillShippingAddress({
      firstName: 'Thanh',
      lastName: 'Son',
      address: '123 abc',
      city: 'Ha Noi',
      zip: '100100',
      phone: '0123456789',
    });

    await expect(checkoutPage.payNowBtn).toBeVisible();
  });
});
