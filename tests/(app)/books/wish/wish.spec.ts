import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読みたい本', () => {
	test('読みたい本の画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.gotoLibrary();

		const pageName = '読みたい';
		await loginedPage.page.getByText(pageName).click();
		await loginedPage.page.waitForURL('/books/wish');
	});
});
