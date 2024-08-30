import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読んでいる本', () => {
	test('読んでいる本の画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.gotoLibrary();

		const pageName = '読んでいる';
		await loginedPage.page.getByText(pageName).click();
		await loginedPage.page.waitForURL('/books/reading');
		await expect(loginedPage.page.getByTestId('headerText')).toHaveText(`${pageName}本`);
	});
});
