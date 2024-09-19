import { SearchURLs } from '$lib/client/Shared/Constants/urls';
import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('書籍検索', () => {
	test('簡易検索で検索結果を表示できること', async ({ loginedPage }) => {
		const pageName = '書籍検索';
		await loginedPage.page
			.locator(`[href="${SearchURLs.search}"]`, { hasNotText: pageName })
			.click();
		await loginedPage.page.waitForURL(SearchURLs.search);
		await expect(loginedPage.page.getByTestId('headerText')).toHaveText(pageName);

		const bookTitle = 'クイーンズ・ギャンビット';
		const input = loginedPage.page.getByRole('textbox', { name: 'query' });
		await input.click();
		await input.fill(bookTitle);
		await loginedPage.page.getByTitle('検索', { exact: true }).click();
		await loginedPage.page.waitForURL(`${SearchURLs.search}?query=${bookTitle}&page=0`);
	});

	test('詳細検索で検索結果を表示できること', async ({ loginedPage }) => {
		const pageName = '書籍検索';
		await loginedPage.page
			.locator(`[href="${SearchURLs.search}"]`, { hasNotText: pageName })
			.click();
		await loginedPage.page.waitForURL(SearchURLs.search);
		await expect(loginedPage.page.getByTestId('headerText')).toHaveText(pageName);

		const bookTitle = 'クイーンズ・ギャンビット';
		await loginedPage.page.getByTestId('btnDisplayDetailQueries').click();
		const input = loginedPage.page.getByRole('textbox', { name: 'title' });
		await input.click();
		await input.fill(bookTitle);
		await loginedPage.page.getByTitle('検索', { exact: true }).click();
		await loginedPage.page.waitForURL(/search\?booktitle=.*&author=&isbn=&page=0/);
	});
});
