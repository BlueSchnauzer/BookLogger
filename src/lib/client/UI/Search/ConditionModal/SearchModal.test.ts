import { describe, it, vitest } from 'vitest';

//ページ遷移をテストできないので、一旦コメントアウト
describe.skip('SearchModal', () => {
	vitest.mock('$app/navigation', () => ({
		goto: vitest.fn()
	}));

	it.skip('検索条件入力時、検索ボタンをクリックした際にページ遷移すること', async () => {});

	it.skip('検索条件未入力時、検索ボタンをクリックしてもページ遷移しないこと', () => {});

	it.skip('閉じる・キャンセルボタンクリック時、モーダルが非表示になること', () => {});
});
