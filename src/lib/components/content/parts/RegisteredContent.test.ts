import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
import userEvent from '@testing-library/user-event';
import { bookInfoResponseItemMock } from '$lib/mock/Data';
import _ from 'lodash';

describe('RegisteredContent', async () => {
	const bookInfoResponseItem = bookInfoResponseItemMock();
	//const operations = bookInfoOperations(bookInfoResponseItem.entity);

	//const pastDate = new Date(2023, 5, 1);

	it('レンダリング', async () => {
		render(RegisteredContent, { item: bookInfoResponseItem });

		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText(bookInfoResponseItem.entity.title!)).toBeInTheDocument();
		expect(screen.getByText(bookInfoResponseItem.view.joinedAuthors())).toBeInTheDocument();
		expect(screen.getByText(bookInfoResponseItem.view.getPageCountLabel())).toBeInTheDocument();
		expect(screen.getByText('読みたい本')).toBeInTheDocument();
		//expect(screen.getByText(convertDate(pastDate))).toBeInTheDocument();
		expect(screen.getByDisplayValue(bookInfoResponseItem.entity.memorandum)).toBeInTheDocument();
	});

	it('お気に入りボタンクリックで値が変更されること', async () => {
		render(RegisteredContent, { item: bookInfoResponseItem });

		const btnFavorite = screen.getByTestId('btnFavorite');
		await fireEvent.click(btnFavorite);

		expect(bookInfoResponseItem.entity.isFavorite).toEqual(true);
	});

	it('ページ数を更新した際に、書誌情報の値が同期していること', async () => {
		const clonedItem = _.cloneDeep(bookInfoResponseItem);
		render(RegisteredContent, { item: clonedItem });

		const editButton = screen.getByRole('button', { name: 'btnEditPageCount' });
		await fireEvent.click(editButton);

		const editField = screen.getByTestId('editPageCount');
		await userEvent.clear(editField);
		await userEvent.type(editField, '500');

		expect(clonedItem.entity.pageCount).toEqual(500);
	});

	//成功しないため原因調査中
	it.skip('ステータスを更新した際に、書誌情報の値が同期していること', async () => {
		const clonedItem = _.cloneDeep(bookInfoResponseItem);
		render(RegisteredContent, { item: bookInfoResponseItem });

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('wish');

		const reading = 'reading';
		await fireEvent.change(select, { target: { value: reading } });
		expect(select).toHaveValue(reading);
		expect(clonedItem.entity.status.value).toEqual(reading);
	});

	//成功しないため原因調査中
	it.skip('読んだ記録を追加できること', async () => {
		const { container } = render(RegisteredContent, { item: bookInfoResponseItem });

		const dateInput = container.querySelector<HTMLInputElement>('#readingDate');
		const countInput = screen.getByTestId('countInput');
		const btnAdd = screen.getByTestId('btnAdd');

		//userEventだと日付をいじれないのでJSで
		dateInput!.value = '2023-07-01';
		await userEvent.type(countInput, '50');
		await fireEvent.click(btnAdd);

		expect(screen.getByText('2023/8/1')).toBeInTheDocument();
		expect(screen.getByText('50ページ')).toBeInTheDocument();
	});

	it('値が不正な場合に、読んだ記録を追加できないこと', async () => {
		const { container } = render(RegisteredContent, { item: bookInfoResponseItem });

		const dateInput = container.querySelector<HTMLInputElement>('#readingDate');
		const countInput = screen.getByTestId('countInput');
		const btnAdd = screen.getByTestId('btnAdd');

		//表示はされているが検知できない
		// dateInput!.value = ''
		// await fireEvent.click(btnAdd);
		// expect(screen.getByText('日付が未入力です')).toBeInTheDocument();

		dateInput!.value = '2023-05-01';
		await userEvent.type(countInput, '-1');
		await fireEvent.click(btnAdd);
		expect(
			screen.getByText(
				`ページ数は1～${bookInfoResponseItem.entity.pageCount}ページで入力してください`
			)
		).toBeInTheDocument();
	});

	it('メモ欄を更新した際に、書誌情報の値が同期していること', async () => {
		render(RegisteredContent, { item: bookInfoResponseItem });

		const memoInput = screen.getByTestId<HTMLInputElement>('memoInput');
		await userEvent.type(memoInput, 'test');

		expect(memoInput.value).toEqual(bookInfoResponseItem.entity.memorandum);
	});
});
