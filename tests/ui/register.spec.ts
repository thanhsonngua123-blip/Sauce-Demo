import { test } from '@/fixtures/page.fixture';

test.describe('Trang register @real', () => {
  test('REGISTER-001: các trường form register hiển thị', async ({ registerPage }) => {
    await registerPage.goTo();

    await registerPage.expectLoaded();
    await registerPage.expectRegisterFormVisible();
  });

  test('REGISTER-002: người dùng nhập được form register', async ({ registerPage }) => {
    await registerPage.goTo();
    await registerPage.expectLoaded();

    await registerPage.fillRegisterForm('Test', 'User', 'test@example.com', 'Password123!');

    await registerPage.expectRegisterFormValues('Test', 'User', 'test@example.com', 'Password123!');
  });

  test('REGISTER-003: người dùng xóa được dữ liệu đã nhập', async ({ registerPage }) => {
    await registerPage.goTo();
    await registerPage.expectLoaded();

    await registerPage.fillRegisterForm('Test', 'User', 'test@example.com', 'Password123!');
    await registerPage.clearRegisterForm();

    await registerPage.expectRegisterFormValues('', '', '', '');
  });

  test('REGISTER-004: gửi form register hiển thị bảo vệ hCaptcha', async ({ registerPage }) => {
    await registerPage.goTo();
    await registerPage.expectLoaded();

    await registerPage.fillRegisterForm(
      'Test',
      'User',
      `test-${Date.now()}@example.com`,
      'Password123!'
    );
    await registerPage.submitRegisterForm();

    await registerPage.expectRegisterProtected();
  });
});
