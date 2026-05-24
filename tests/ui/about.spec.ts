import { test } from '@/fixtures/page.fixture';

test.describe('Trang About Us @real', () => {
  test('ABOUT-001: trang About Us mở được', async ({ aboutPage }) => {
    await aboutPage.goTo();

    await aboutPage.expectLoaded();
  });

  test('ABOUT-002: nội dung chính trang About Us hiển thị', async ({ aboutPage }) => {
    await aboutPage.goTo();

    await aboutPage.expectLoaded();
    await aboutPage.expectMainContentVisible();
  });
});
