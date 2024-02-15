import { test as base, type Page } from '@playwright/test'

//ログイン、ログアウト処理を持ったベースクラスを返す

class TestSetup {
  constructor(public readonly page: Page){ }

  async login() {
    await this.page.goto('/login');
    //onMountでローダーを出し終わったらdisableを解除するのでそれまで待機する
    await this.page.getByRole('button', { disabled: false, name: 'btnGoogleLogin'}).waitFor({state: 'visible'});
		
    //inputが空のまま操作が進んでしまう時があるのでクリックの待機も挟む
    const mail = 'メールアドレス';
		await this.page.getByPlaceholder(mail).click();
		await this.page.getByPlaceholder(mail).fill(process.env.TEST_LOGIN_EMAIL!);
    const password = 'パスワード';
		await this.page.getByPlaceholder(password).click();
		await this.page.getByPlaceholder(password).fill(process.env.TEST_LOGIN_PASSWORD!);

		await this.page.getByTestId('btnLogin').click();
		await this.page.waitForURL('/home');

    //ログイン後に初回DB接続があり少し時間がかかるので、パスだけでなく要素の読み込みも待機
    //(テストケースでの操作が余裕をもって開始できるように)
    await this.page.getByTestId('headerText').waitFor({state: 'visible'});
  }

  async logout() {
		await this.page.getByTestId('btnLogoutInSide').click();
		await this.page.getByTestId('btnLogin');
  }

  /**ライブラリ画面に移動する */
  async gotoLibrary() {
    const pageName = 'ライブラリ';
    await this.page.locator('[href="/books"]', {hasNotText: pageName}).click();
    await this.page.waitForURL('/books');
    await this.page.getByTestId('headerText');
  }
}

export const test = base.extend<{loginedPage: TestSetup}>({
  loginedPage: async ({ page }, use) => {
    const loginAndLogout = new TestSetup(page);
    await loginAndLogout.login();

    await use(loginAndLogout);

    await loginAndLogout.logout();
  }
});

export { expect } from '@playwright/test';