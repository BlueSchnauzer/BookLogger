import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読み終わった本', () => {
  test('読み終わった本の画面が表示できること', async ({ loginedPage }) => {
    await loginedPage.page.getByText('読み終わった本').click();
    await expect(loginedPage.page.waitForURL('/books/complete')).toBeTruthy();
  });
})