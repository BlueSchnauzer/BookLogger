import { test, expect } from '../../fixtures/loginAndLogout';

test.describe('登録した本', () => {
  test('登録した本の画面が表示できること', async ({ loginedPage }) => {
    await loginedPage.page.getByText('登録した本').click();
    await expect(loginedPage.page.waitForURL('/books')).toBeTruthy();
  });
})