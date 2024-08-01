import { expect, test } from '@playwright/test';

test.describe('login', () => {
	test('ログインページが表示できるか', async ({ page }) => {
		await page.goto('/login');
		await expect(page.getByText('Googleアカウントでログイン')).toBeVisible();
	});

	test('Emailとパスワードでログインし、ログアウトができること', async ({ page }) => {
		await page.goto('/login');
		await page
			.getByRole('button', { disabled: false, name: 'btnGoogleLogin' })
			.waitFor({ state: 'visible' });

		const mail = 'メールアドレス';
		await page.getByPlaceholder(mail).click();
		await page.getByPlaceholder(mail).fill(process.env.TEST_LOGIN_EMAIL!);
		const password = 'パスワード';
		await page.getByPlaceholder(password).click();
		await page.getByPlaceholder(password).fill(process.env.TEST_LOGIN_PASSWORD!);

		await page.getByTestId('btnLogin').click();
		await expect(page.waitForURL('/home')).toBeTruthy();

		await page.getByTestId('btnLogoutInSide').click();
		await expect(page.getByTestId('btnLogin')).toBeVisible();
	});

	//googleアカウント認証はテストが不安定なため保留
});
