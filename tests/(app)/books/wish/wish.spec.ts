import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読みたい本', () => {
  test('読みたい本の画面が表示できること', async ({ loginedPage }) => {
    await loginedPage.page.getByText('読みたい本').click();
    await expect(loginedPage.page.waitForURL('/books/wish')).toBeTruthy();
  });
})