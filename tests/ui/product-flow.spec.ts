import { test } from '@/fixtures/page.fixture';

test.describe('Product browsing flow', () => {
  test('người dùng từ Home vào Catalog rồi mở Grey jacket', async ({
    homePage,
    catalogPage,
    productPage,
  }) => {
    await homePage.goTo();
    await homePage.expectLoaded();

    await homePage.goToCatalog();

    await catalogPage.expectLoaded();
    await catalogPage.openProduct(/Grey jacket/i);

    await productPage.expectProductUrl(/grey-jacket/);
    await productPage.expectProductVisible('Grey jacket', '£55.00');
  });

  test('người dùng từ Home vào Catalog rồi mở Noir jacket', async ({
    homePage,
    catalogPage,
    productPage,
  }) => {
    await homePage.goTo();
    await homePage.expectLoaded();

    await homePage.goToCatalog();

    await catalogPage.expectLoaded();
    await catalogPage.openProduct(/Noir jacket/i);

    await productPage.expectProductUrl(/noir-jacket/);
    await productPage.expectProductVisible('Noir jacket', '£60.00');
  });
});
