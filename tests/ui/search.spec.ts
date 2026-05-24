import { expect, test } from '@/fixtures/page.fixture';

test.describe('Trang tìm kiếm @real', () => {
  test('SEARCH-001: trang tìm kiếm mở được', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
  });

  test('SEARCH-002: link về trang chủ hiển thị khi chưa có kết quả tìm kiếm', async ({ searchPage }) => {
    await searchPage.goTo();

    await searchPage.expectLoaded();
    await searchPage.expectEmptySearchState();
    await searchPage.expectHomepageLinkVisible();
  });

  test('SEARCH-003: tìm kiếm jacket trả về sản phẩm phù hợp', async ({ searchPage }) => {
    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('jacket');

    await searchPage.expectLoaded();
    await searchPage.expectShowingResultsFor('jacket');
    await searchPage.expectResultVisible(/Grey jacket/i);
    await searchPage.expectResultVisible(/Noir jacket/i);
  });

  test('SEARCH-004: từ khóa không tồn tại hiển thị trạng thái không có kết quả', async ({ searchPage }) => {
    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('zzzznotfound');

    await searchPage.expectLoaded();
    await searchPage.expectNoResultsFor('zzzznotfound');
  });

  test('SEARCH-005: tìm kiếm từ header cập nhật query trên URL', async ({ homePage, page }) => {
    await homePage.goTo();
    await homePage.expectLoaded();

    await homePage.searchFromHeader('jacket');

    await expect(page).toHaveURL(/\/search\?type=product&q=jacket/);
  });

  test('SEARCH-006: tìm kiếm không phân biệt chữ hoa chữ thường', async ({ searchPage }) => {
    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('JACKET');

    await searchPage.expectLoaded();
    await searchPage.expectShowingResultsFor('JACKET');
    await searchPage.expectResultVisible(/Grey jacket/i);
    await searchPage.expectResultVisible(/Noir jacket/i);
  });

  test('SEARCH-007: tìm kiếm sandals trả về sản phẩm sandals', async ({ searchPage }) => {
    await searchPage.goTo();
    await searchPage.expectLoaded();

    await searchPage.search('sandals');

    await searchPage.expectLoaded();
    await searchPage.expectShowingResultsFor('sandals');
    await searchPage.expectResultVisible(/Bronze sandals/i);
    await searchPage.expectResultVisible(/White sandals/i);
  });
});
