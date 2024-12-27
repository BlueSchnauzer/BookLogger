import { BooksURLs } from '$lib/client/Shared/Constants/urls';
import { test } from '../../../fixtures/loginAndLogout';

test.describe('読んでいる本', () => {
	test('読んでいる本の画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.gotoLibrary();

		await loginedPage.page.locator(`[href="${BooksURLs.reading}"]`).click();
		await loginedPage.page.waitForURL(BooksURLs.reading);
	});
});
