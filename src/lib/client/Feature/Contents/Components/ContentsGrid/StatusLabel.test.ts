import StatusLabel from '$lib/client/Feature/Contents/Components/ContentsGrid/StatusLabel.svelte';
import { PageHistory } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

//context api がテストだと利用できないためスキップ
describe.skip('StatusLabel', () => {
	it('登録日のステータスでレンダリングできること', () => {
		const bookInfo = bookInfoInterfaceMock;

		const screen = render(StatusLabel, { bookInfo });

		expect(screen.getByText('登録日')).toBeInTheDocument();
	});

	it('読んでいるページ数でレンダリングできること', () => {
		const bookInfo = bookInfoInterfaceMock;

		bookInfo.pageHistories?.push(
			new PageHistory({
				date: new Date(),
				pageCount: bookInfo.pageCount / 2
			})
		);
		const screen = render(StatusLabel, { bookInfo });

		expect(screen.getByText('読んだページ数')).toBeInTheDocument();
		expect(screen.getByTestId('pageProgress').style.width).toEqual('50%');
	});

	//そもそも総ページ数が無い本は編集することが無意味だが
	it('総ページ数の無い書誌データの場合、更新日が表示されること', () => {
		const bookInfo = bookInfoInterfaceMock;
		bookInfo.pageCount = 0;

		const screen = render(StatusLabel, { bookInfo });

		expect(screen.getByText('更新日')).toBeInTheDocument();
	});

	it('読み終わった日のステータスでレンダリングできること', () => {
		const bookInfo = bookInfoInterfaceMock;
		bookInfo.status = new Status('complete');
		bookInfo.pageHistories?.push(
			new PageHistory({ date: new Date(), pageCount: bookInfo.pageCount })
		);

		const screen = render(StatusLabel, { bookInfo });

		expect(screen.getByText('読み終わった日')).toBeInTheDocument();
	});
});
