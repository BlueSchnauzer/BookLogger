import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読んでいる本', () => {
  test('読んでいる本の画面が表示できること', async ({ loginedPage }) => {
    await loginedPage.page.getByText('読んでいる本').click();
    await expect(loginedPage.page.waitForURL('/books/reading')).toBeTruthy();
  });
})