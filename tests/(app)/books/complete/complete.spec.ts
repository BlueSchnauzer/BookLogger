import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('読み終わった本', () => {
	test('読み終わった本の画面が表示できること', async ({ loginedPage }) => {
		await loginedPage.gotoLibrary();

		const pageName = '読み終わった';
		await loginedPage.page.getByText(pageName).click();
		await expect(loginedPage.page.waitForURL('/books/complete')).toBeTruthy();
		await expect(loginedPage.page.getByTestId('headerText')).toHaveText(`${pageName}本`);
	});
});
