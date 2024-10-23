import { test } from '../../../fixtures/loginAndLogout';

test.describe.skip('詳細', () => {
	test('詳細画面が表示できること', async ({ loginedPage }) => {
		const pageName = 'ライブラリ';
		await loginedPage.page.locator('[href="/books"]', { hasNotText: pageName }).click();
		await loginedPage.page.waitForURL('/books');

		//書誌データが登録されていないのでエラーになる
		await loginedPage.page.locator('.grid > li:first-child').click();
		await loginedPage.page.waitForURL(/books\/.*/);

		await loginedPage.page.getByTestId('btnClose').click();
	});
});
