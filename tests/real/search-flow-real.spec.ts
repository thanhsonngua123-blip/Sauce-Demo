import { test } from '@/fixtures/page.fixture';

test.describe('Luồng tìm kiếm thật @real @e2e', () => {
  test('REAL-SEARCH-001: tìm kiếm từ header và mở chi tiết Grey jacket', async ({
    homePage,
    searchPage,
    productPage,
  }) => {
    await homePage.goTo();
    await homePage.expectLoaded();

    await homePage.searchFromHeader('jacket');

    await searchPage.expectLoaded();
    await searchPage.expectShowingResultsFor('jacket');
    await searchPage.expectResultVisible(/Grey jacket/i);

    await searchPage.openResult(/Grey jacket/i);

    await productPage.expectProductUrl(/products\/grey-jacket/);
    await productPage.expectProductVisible('Grey jacket', 'Â£55.00');
  });
});
