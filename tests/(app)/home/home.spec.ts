import { test, expect } from '../../fixtures/loginAndLogout';

test.describe('ホーム画面', () => {
  test('ホーム画面が表示できるか', async ( { loginedPage }) => {
    await expect(loginedPage.page.getByTestId('headerText')).toHaveText('ホーム');
    await expect(loginedPage.page.getByTestId('recentbook')).toBeVisible();
    await expect(loginedPage.page.getByTestId('pageGraph')).toBeVisible();
  })
});