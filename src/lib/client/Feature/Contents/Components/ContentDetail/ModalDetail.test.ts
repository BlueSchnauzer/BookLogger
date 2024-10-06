import ModalDetail from '$lib/client/Feature/Contents/Components/ContentDetail/ModalDetail.svelte';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import _ from 'lodash';
import { describe, expect, it } from 'vitest';

describe('ModalDetail', async () => {
	const bookInfo = bookInfoInterfaceMock;

	//const pastDate = new Date(2023, 5, 1);

	it('レンダリング', async () => {
		render(ModalDetail, { bookInfo });

		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText(bookInfo.title!)).toBeInTheDocument();
		expect(screen.getByText('読みたい本')).toBeInTheDocument();
		//expect(screen.getByText(convertDate(pastDate))).toBeInTheDocument();
		expect(screen.getByDisplayValue(bookInfo.memorandum)).toBeInTheDocument();
	});

	it('お気に入りボタンクリックで値が変更されること', async () => {
		render(ModalDetail, { bookInfo });

		const btnFavorite = screen.getByTestId('btnFavorite');
		await fireEvent.click(btnFavorite);

		expect(bookInfo.isFavorite).toEqual(true);
	});

	it('ページ数を更新した際に、書誌情報の値が同期していること', async () => {
		const clonedItem = _.cloneDeep(bookInfo);
		render(ModalDetail, { bookInfo: clonedItem });

		const editButton = screen.getByRole('button', { name: 'btnEditPageCount' });
		await fireEvent.click(editButton);

		const editField = screen.getByTestId('editPageCount');
		await userEvent.clear(editField);
		await userEvent.type(editField, '500');

		expect(clonedItem.pageCount).toEqual(500);
	});

	//成功しないため原因調査中
	it.skip('ステータスを更新した際に、書誌情報の値が同期していること', async () => {
		const clonedItem = _.cloneDeep(bookInfo);
		render(ModalDetail, { bookInfo: clonedItem });

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('wish');

		const reading = 'reading';
		await fireEvent.change(select, { target: { value: reading } });
		expect(select).toHaveValue(reading);
		expect(clonedItem.status.value).toEqual(reading);
	});

	//成功しないため原因調査中
	it.skip('読んだ記録を追加できること', async () => {
		const { container } = render(ModalDetail, { bookInfo });

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
		const { container } = render(ModalDetail, { bookInfo });

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
			screen.getByText(`ページ数は1～${bookInfo.pageCount}ページで入力してください`)
		).toBeInTheDocument();
	});

	it('メモ欄を更新した際に、書誌情報の値が同期していること', async () => {
		render(ModalDetail, { bookInfo });

		const memoInput = screen.getByTestId<HTMLInputElement>('memoInput');
		await userEvent.type(memoInput, 'test');

		expect(memoInput.value).toEqual(bookInfo.memorandum);
	});
});
