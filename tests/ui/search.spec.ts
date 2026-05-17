import { test } from '@/fixtures/page.fixture';

test.describe('Search page', () => {
  test('SEARCH-001: search page mở được', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
  });

  test('SEARCH-002: search page hiển thị empty state khi chưa search', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
    await searchPage.expectEmptySearchState();
  });

  test('SEARCH-003: homepage link hiển thị trong empty search state', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
    await searchPage.expectEmptySearchState();
    await searchPage.expectHomepageLinkVisible();
  });

  test('SEARCH-004: search jacket hiển thị sản phẩm phù hợp', async ({ searchPage }) => {
    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('jacket');

    await searchPage.expectLoaded();
    await searchPage.expectShowingResultsFor('jacket');
    await searchPage.expectResultVisible(/Grey jacket/i);
    await searchPage.expectResultVisible(/Noir jacket/i);
  });

  test('SEARCH-005: search keyword không tồn tại hiển thị no results', async ({ searchPage }) => {
    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('zzzznotfound');

    await searchPage.expectLoaded();
    await searchPage.expectNoResultsFor('zzzznotfound');
  });
});
