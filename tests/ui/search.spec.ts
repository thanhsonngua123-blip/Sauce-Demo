import { expect, test } from '@/fixtures/page.fixture';
import { mockSearchResults } from '@/tests/support/mocks';

test.describe('Search page', () => {
  test('SEARCH-001: search page mở được', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
  });

  test('SEARCH-002: homepage link hiển thị trong empty search state', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
    await searchPage.expectEmptySearchState();
    await searchPage.expectHomepageLinkVisible();
  });

  test('SEARCH-003: search jacket hiển thị sản phẩm phù hợp', async ({ searchPage, page }) => {
    await mockSearchResults(
      page,
      'jacket',
      `
        <h1>Search Results</h1>
        <p>Showing results for jacket</p>
        <a href="/products/grey-jacket"><h3>Grey jacket</h3><h4>£55.00</h4></a>
        <a href="/products/noir-jacket"><h3>Noir jacket</h3><h4>£60.00</h4></a>
      `
    );

    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('jacket');

    await searchPage.expectLoaded();
    await searchPage.expectShowingResultsFor('jacket');
    await searchPage.expectResultVisible(/Grey jacket/i);
    await searchPage.expectResultVisible(/Noir jacket/i);
  });

  test('SEARCH-004: search keyword không tồn tại hiển thị no results', async ({
    searchPage,
    page,
  }) => {
    await mockSearchResults(
      page,
      'zzzznotfound',
      `
        <h1>Search Results</h1>
        <p>No results found for zzzznotfound</p>
      `
    );

    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('zzzznotfound');

    await searchPage.expectLoaded();
    await searchPage.expectNoResultsFor('zzzznotfound');
  });

  test('SEARCH-005: header search submit cập nhật URL query', async ({ homePage, page }) => {
    await homePage.goTo();
    await homePage.expectLoaded();

    await homePage.searchFromHeader('jacket');

    await expect(page).toHaveURL(/\/search\?type=product&q=jacket/);
  });
});
