import { test } from '@/fixtures/page.fixture';

test.describe('About Us page', () => {
  test('ABOUT-001: About Us page mở được', async ({ aboutPage }) => {
    await aboutPage.goTo();

    await aboutPage.expectLoaded();
  });

  test('ABOUT-002: About Us main content hiển thị', async ({ aboutPage }) => {
    await aboutPage.goTo();

    await aboutPage.expectLoaded();
    await aboutPage.expectMainContentVisible();
  });
});
