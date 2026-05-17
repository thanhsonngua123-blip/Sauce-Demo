import { test } from '@/fixtures/page.fixture';

test.describe('Smoke tests with fixtures', () => {
  test('HOME-001: trang chủ mở được', async ({ homePage }) => {
    await homePage.goTo();

    await homePage.expectLoaded();
  });

  test('CAT-001: catalog page mở được', async ({ catalogPage }) => {
    await catalogPage.goTo();

    await catalogPage.expectLoaded();
  });

  test('PROD-001: Grey jacket detail mở được', async ({ productPage }) => {
    await productPage.goTo('grey-jacket');

    await productPage.expectProductUrl(/grey-jacket/);
    await productPage.expectProductVisible('Grey jacket', '£55.00');
  });

  test('PROD-002: Noir jacket detail mở được', async ({ productPage }) => {
    await productPage.goTo('noir-jacket');

    await productPage.expectProductUrl(/noir-jacket/);
    await productPage.expectProductVisible('Noir jacket', '£60.00');
  });

  test('CART-001: cart page mở được ở trạng thái rỗng', async ({ cartPage }) => {
    await cartPage.goTo();

    await cartPage.expectLoaded();
    await cartPage.expectCartEmpty();
  });

  test('LOGIN-001: login page mở được', async ({ loginPage }) => {
    await loginPage.goTo();

    await loginPage.expectLoaded();
    await loginPage.expectLoginFormVisible();
  });

  test('SEARCH-001: search page mở được', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
    await searchPage.expectEmptySearchState();
  });

  test('ABOUT-001: about page mở được', async ({ aboutPage }) => {
    await aboutPage.goTo();

    await aboutPage.expectLoaded();
  });
});
