import { test, expect } from '../../fixtures/loginAndLogout';

test.describe('登録した本', () => {
  test('登録した本の画面が表示できること', async ({ loginedPage }) => {
    const pageName = '登録した本';
    await loginedPage.page.getByText(pageName).click();
    await expect(loginedPage.page.waitForURL('/books')).toBeTruthy();
    await expect(loginedPage.page.getByTestId('headerText')).toHaveText(pageName);
  });
})