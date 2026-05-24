import { test, expect } from '@/fixtures/page.fixture';
import { products } from '@/test-data/products';

test.describe('Trang catalog @real', () => {
  test('CAT-001: trang catalog mở được', async ({ catalogPage }) => {
    await catalogPage.goTo();

    await catalogPage.expectLoaded();
  });

  test('CAT-002: catalog hiển thị toàn bộ sản phẩm trong dữ liệu test', async ({ catalogPage }) => {
    await catalogPage.goTo();
    await catalogPage.expectLoaded();

    for (const product of products) {
      await catalogPage.expectProductVisible(new RegExp(product.name, 'i'));
    }
  });

  test('CAT-003: catalog hiển thị trạng thái hết hàng cho sản phẩm hết hàng', async ({
    catalogPage,
    page,
  }) => {
    await catalogPage.goTo();
    await catalogPage.expectLoaded();

    const soldOutProducts = products.filter((product) => product.soldOut);

    for (const product of soldOutProducts) {
      const productLink = page.getByRole('link', {
        name: new RegExp(product.name, 'i'),
      });

      await expect(productLink).toBeVisible();
    }

    await catalogPage.expectSoldOutVisible();
  });

  test('CAT-004: nhấn Grey jacket mở trang chi tiết sản phẩm', async ({ catalogPage, productPage }) => {
    await catalogPage.goTo();
    await catalogPage.expectLoaded();

    await catalogPage.openProduct(/Grey jacket/i);

    await productPage.expectProductUrl(/grey-jacket/);
    await productPage.expectProductVisible('Grey jacket', '£55.00');
  });
});
