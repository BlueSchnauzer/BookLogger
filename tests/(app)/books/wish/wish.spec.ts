import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読みたい本', () => {
  test('読みたい本の画面が表示できること', async ({ loginedPage }) => {
    const pageName = '読みたい本';
    await loginedPage.page.getByText(pageName).click();
    await expect(loginedPage.page.waitForURL('/books/wish')).toBeTruthy();
    await expect(loginedPage.page.getByTestId('headerText')).toHaveText(pageName);
  });
})