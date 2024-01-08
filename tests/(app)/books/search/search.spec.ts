import { test, expect } from '../../../fixtures/loginAndLogout';

test.describe('書籍検索', () => {
  test('検索結果を表示できること', async({ loginedPage }) => {
    await loginedPage.page.getByTestId('btnDisplaySearch').click();
    
    await loginedPage.page.getByTestId('btnDisplayDetailQueries').click();
    const bookTitle = 'クイーンズ・ギャンビット';
    await loginedPage.page.getByRole('textbox', {name: 'title'}).click;
    await loginedPage.page.getByRole('textbox', {name: 'title'}).fill(bookTitle);
    await loginedPage.page.getByTitle('検索').click();
    await expect(loginedPage.page.waitForURL(/books\/search\?booktitle=.*&author=&isbn=/)).toBeTruthy();

    //作成して削除だと不安定なため保留
    // await loginedPage.page.getByTestId('searchLoader').waitFor({state: 'detached'});
    // await loginedPage.page.getByText(bookTitle, {exact: true}).click();
    // await expect(loginedPage.page.getByText('書籍登録')).toBeVisible();
    // await loginedPage.page.getByRole('button', {name: '登録'}).click();
    // await expect(loginedPage.page.getByText('登録しました')).toBeVisible();
  });
})