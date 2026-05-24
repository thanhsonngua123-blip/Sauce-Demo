import { test } from '@/fixtures/page.fixture';
import { products } from '@/test-data/products';

test.describe('Trang chi tiết sản phẩm @real', () => {
  products.forEach((product) => {
    test(`PROD-003: trang chi tiết ${product.name} hiển thị đúng tên và giá`, async ({
      productPage,
    }) => {
      await productPage.goTo(product.slug);

      await productPage.expectProductUrl(new RegExp(product.slug));
      await productPage.expectProductVisible(product.name, product.price);
    });
  });

  test('PROD-004: Brown Shades hết hàng nên không thêm được vào giỏ hàng', async ({ productPage }) => {
    await productPage.goTo('brown-shades');

    await productPage.expectProductUrl(/brown-shades/);
    await productPage.expectProductVisible('Brown Shades', '£20.00');
    await productPage.expectSoldOutVisible();
  });

  test('PROD-005: người dùng chọn được size và màu sản phẩm', async ({ productPage }) => {
    await productPage.goTo('noir-jacket');

    await productPage.expectProductUrl(/noir-jacket/);
    await productPage.expectProductVisible('Noir jacket', '£60.00');
    await productPage.selectSize('M');
    await productPage.selectColor('Red');

    await productPage.expectSelectedVariant('M / Red - £60.00');
    await productPage.expectAddToCartVisible();
  });
});
