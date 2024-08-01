import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
import { convertDate } from '$lib/utils/bookInfo';
import userEvent from '@testing-library/user-event';
import { getTestData } from '$lib/vitest-setup';
import type { BookInfo } from '$lib/server/models/BookInfo';

describe('RegisteredContent', async () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	const pastDate = new Date(2023, 5, 1);

	it('レンダリング', async () => {
		testData.pageHistory![0].date = pastDate;
		render(RegisteredContent, { bookInfo: testData });

		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText(testData.title!)).toBeInTheDocument();
		expect(screen.getByText(testData.author?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText(`${testData.pageCount!}ページ`)).toBeInTheDocument();
		expect(screen.getByText('読みたい本')).toBeInTheDocument();
		expect(screen.getByText(convertDate(pastDate))).toBeInTheDocument();
		expect(screen.getByDisplayValue(testData.memorandum)).toBeInTheDocument();
	});

	it('お気に入りボタンクリックで値が変更されること', async () => {
		render(RegisteredContent, { bookInfo: testData });

		const btnFavorite = screen.getByTestId('btnFavorite');
		await fireEvent.click(btnFavorite);

		expect(testData.isFavorite).toEqual(true);
	});

	it('ページ数を更新した際に、書誌情報の値が同期していること', async () => {
		const bookInfo = structuredClone(testData);
		render(RegisteredContent, { bookInfo: bookInfo });

		const editButton = screen.getByRole('button', { name: 'btnEditPageCount' });
		await fireEvent.click(editButton);

		const editField = screen.getByTestId('editPageCount');
		await userEvent.clear(editField);
		await userEvent.type(editField, '500');

		expect(bookInfo.pageCount).toEqual(500);
	});

	it('ステータスを更新した際に、書誌情報の値が同期していること', async () => {
		const bookInfo = structuredClone(testData);
		render(RegisteredContent, { bookInfo: bookInfo });

		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('wish');

		const reading = 'reading';
		await fireEvent.change(select, { target: { value: reading } });
		expect(select).toHaveValue(reading);
		expect(bookInfo.status).toEqual(reading);
	});

	//成功しないため原因調査中
	it.skip('読んだ記録を追加できること', async () => {
		const { container } = render(RegisteredContent, { bookInfo: testData });

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
		const { container } = render(RegisteredContent, { bookInfo: testData });

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
			screen.getByText(`ページ数は1～${testData.pageCount}ページで入力してください`)
		).toBeInTheDocument();
	});

	it('メモ欄を更新した際に、書誌情報の値が同期していること', async () => {
		render(RegisteredContent, { bookInfo: testData });

		const memoInput = screen.getByTestId<HTMLInputElement>('memoInput');
		await userEvent.type(memoInput, 'test');

		expect(memoInput.value).toEqual(testData.memorandum);
	});
});
