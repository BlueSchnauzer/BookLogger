import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読んでいる本', () => {
  test('読んでいる本の画面が表示できること', async ({ loginedPage }) => {
    const pageName = '読んでいる本';
    await loginedPage.page.getByText(pageName).click();
    await expect(loginedPage.page.waitForURL('/books/reading')).toBeTruthy();
    await expect(loginedPage.page.getByTestId('headerText')).toHaveText(pageName);
  });
})