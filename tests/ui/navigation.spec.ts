import { test } from '@/fixtures/page.fixture';

test.describe('Navigation', () => {
  test('NAV-001: người dùng vào được Catalog từ Home', async ({ homePage, catalogPage }) => {
    await homePage.goTo();

    await homePage.goToCatalog();

    await catalogPage.expectLoaded();
  });

  test('NAV-002: người dùng vào được Login từ Home', async ({ homePage, loginPage }) => {
    await homePage.goTo();

    await homePage.goToLogin();

    await loginPage.expectLoaded();
  });

  test('NAV-003: người dùng vào được About Us từ Home', async ({ homePage, aboutPage }) => {
    await homePage.goTo();

    await homePage.goToAboutUs();

    await aboutPage.expectLoaded();
  });

  test('NAV-004: người dùng vào được Search từ Home', async ({ homePage, searchPage }) => {
    await homePage.goTo();

    await homePage.goToSearch();

    await searchPage.expectLoaded();
  });

  test('NAV-005: người dùng vào được Cart từ Home', async ({ homePage, cartPage }) => {
    await homePage.goTo();

    await homePage.goToCart();

    await cartPage.expectLoaded();
  });
});
