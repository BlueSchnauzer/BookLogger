import { test, expect } from '../../fixtures/loginAndLogout';

test.describe('ライブラリ', () => {
	test('ライブラリ画面が表示できること', async ({ loginedPage }) => {
		const pageName = 'ライブラリ';
		await loginedPage.page.locator('[href="/books"]', { hasNotText: pageName }).click();
		await expect(loginedPage.page.waitForURL('/books')).toBeTruthy();
	});
});
