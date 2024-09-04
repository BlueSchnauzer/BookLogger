import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import StatusLabel from '$lib/client/UI/Contents/ContentsGrid/StatusLabel.svelte';
import { bookInfoResponseItemMock } from '$lib/mock/Data';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

//context api がテストだと利用できないためスキップ
describe.skip('StatusLabel', () => {
	it('登録日のステータスでレンダリングできること', () => {
		const item = bookInfoResponseItemMock();

		const screen = render(StatusLabel, { view: item.view });

		expect(screen.getByText('登録日')).toBeInTheDocument();
	});

	it('読んでいるページ数でレンダリングできること', () => {
		const item = bookInfoResponseItemMock();

		item.entity.pageHistories?.push(
			new PageHistory({
				date: new Date(),
				pageCount: item.entity.pageCount / 2
			})
		);
		const screen = render(StatusLabel, { view: item.view });

		expect(screen.getByText('読んだページ数')).toBeInTheDocument();
		expect(screen.getByTestId('pageProgress').style.width).toEqual('50%');
	});

	//そもそも総ページ数が無い本は編集することが無意味だが
	it('総ページ数の無い書誌データの場合、更新日が表示されること', () => {
		const item = bookInfoResponseItemMock();
		item.entity.pageCount = 0;

		const screen = render(StatusLabel, { view: item.view });

		expect(screen.getByText('更新日')).toBeInTheDocument();
	});

	it('読み終わった日のステータスでレンダリングできること', () => {
		const item = bookInfoResponseItemMock();
		item.entity.status = new Status('complete');
		item.entity.pageHistories?.push(
			new PageHistory({ date: new Date(), pageCount: item.entity.pageCount })
		);

		const screen = render(StatusLabel, { view: item.view });

		expect(screen.getByText('読み終わった日')).toBeInTheDocument();
	});
});
