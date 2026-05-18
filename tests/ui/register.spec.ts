import { test } from '@/fixtures/page.fixture';

test.describe('Register page', () => {
  test('REGISTER-001: register page mở được và form hiển thị', async ({ registerPage }) => {
    await registerPage.goTo();

    await registerPage.expectLoaded();
    await registerPage.expectRegisterFormVisible();
  });

  test('REGISTER-002: người dùng nhập được register form', async ({ registerPage }) => {
    await registerPage.goTo();
    await registerPage.expectLoaded();

    await registerPage.fillRegisterForm('Test', 'User', 'test@example.com', 'Password123!');

    await registerPage.expectRegisterFormValues('Test', 'User', 'test@example.com', 'Password123!');
  });

  test('REGISTER-003: submit register form hiển thị bảo vệ hCaptcha', async ({ registerPage }) => {
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
