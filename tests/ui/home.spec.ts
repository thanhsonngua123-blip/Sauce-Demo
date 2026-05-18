import { test, expect } from '@/fixtures/page.fixture';
import { featuredProducts } from '../../test-data/products';

test.describe('Home page', () => {
  test('HOME-001: trang chủ mở được và hiển thị slogan', async ({ homePage }) => {
    await homePage.goTo();

    await homePage.expectLoaded();
  });

  test('HOME-002: header/navigation links hiển thị', async ({ homePage }) => {
    await homePage.goTo();

    await homePage.expectMainNavigationVisible();
  });

  test('HOME-003: featured products hiển thị trên trang chủ', async ({ homePage }) => {
    await homePage.goTo();

    for (const productName of featuredProducts) {
      await homePage.expectFeaturedProductVisible(new RegExp(productName, 'i'));
    }
  });

  test('HOME-004: cart link hiển thị số lượng giỏ hàng ban đầu', async ({ homePage, page }) => {
    await homePage.goTo();

    await expect(page.getByRole('link', { name: /My Cart\s*\(0\)/i })).toBeVisible();
  });
});
