import { BooksURLs } from '$lib/client/Shared/Constants/urls';
import { test } from '../../../fixtures/loginAndLogout';

test.describe('読み終わった本', () => {
	test('読み終わった本の画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.gotoLibrary();

		await loginedPage.page.locator(`[href="${BooksURLs.complete}"]`).click();
		await loginedPage.page.waitForURL(BooksURLs.complete);
	});
});
