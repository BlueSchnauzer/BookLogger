import { BooksURLs } from '$lib/client/Shared/Constants/urls';
import { test } from '../../../fixtures/loginAndLogout';

test.describe('読みたい本', () => {
	test('読みたい本の画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.gotoLibrary();

		await loginedPage.page.locator(`[href="${BooksURLs.wish}"]`).click();
		await loginedPage.page.waitForURL(BooksURLs.wish);
	});
});
