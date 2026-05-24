import { expect, test } from '@/fixtures/page.fixture';
import { routes } from '@/test-data/routes';

test.describe('Kiểm tra khói với fixture @real', () => {
  test('HOME-001: trang chủ mở được', async ({ homePage }) => {
    await homePage.goTo();

    await homePage.expectLoaded();
  });

  test('CAT-001: trang catalog mở được', async ({ catalogPage }) => {
    await catalogPage.goTo();

    await catalogPage.expectLoaded();
  });

  test('PROD-001: trang chi tiết Grey jacket mở được', async ({ productPage }) => {
    await productPage.goTo('grey-jacket');

    await productPage.expectProductUrl(/grey-jacket/);
    await productPage.expectProductVisible('Grey jacket', '£55.00');
  });

  test('PROD-002: trang chi tiết Noir jacket mở được', async ({ productPage }) => {
    await productPage.goTo('noir-jacket');

    await productPage.expectProductUrl(/noir-jacket/);
    await productPage.expectProductVisible('Noir jacket', '£60.00');
  });

  test('LOGIN-001: trang login mở được', async ({ loginPage }) => {
    await loginPage.goTo();

    await loginPage.expectLoaded();
    await loginPage.expectLoginFormVisible();
  });

  test('SEARCH-001: trang tìm kiếm mở được', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
    await searchPage.expectEmptySearchState();
  });

  test('ABOUT-001: trang About Us mở được', async ({ aboutPage }) => {
    await aboutPage.goTo();

    await aboutPage.expectLoaded();
  });

  test('BLOG-001: trang blog mở được', async ({ page }) => {
    await page.goto(routes.blog);

    await expect(page).toHaveURL(/blogs\/news/);
    await expect(page.getByRole('heading', { name: 'First Post' })).toBeVisible();
  });
});
