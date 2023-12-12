import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読み終わった本', () => {
  test('読み終わった本の画面が表示できること', async ({ loginedPage }) => {
    const pageName = '読み終わった本';
    await loginedPage.page.getByText(pageName).click();
    await expect(loginedPage.page.waitForURL('/books/complete')).toBeTruthy();
    await expect(loginedPage.page.getByTestId('headerText')).toHaveText(pageName);
  });
})