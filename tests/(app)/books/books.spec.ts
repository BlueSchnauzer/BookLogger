import { BooksURLs } from '$lib/client/Shared/Constants/urls';
import { test } from '../../fixtures/loginAndLogout';

test.describe('ライブラリ', () => {
	test('ライブラリ画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.page
			.locator(`[href="${BooksURLs.books}"]`, { hasNotText: 'ライブラリ' })
			.click();
		await loginedPage.page.waitForURL(BooksURLs.books);
	});
});
