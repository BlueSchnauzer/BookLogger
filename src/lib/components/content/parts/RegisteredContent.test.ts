import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { ObjectId } from 'mongodb';
import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
import { convertDate } from '$lib/utils';
import userEvent from '@testing-library/user-event';

describe('RegisteredContent', async () => {
  const pastDate = new Date(2023, 5, 1);
  const bookInfo: BookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
    thumbnail: '',
    createDate: pastDate,
    updateDate: pastDate,
    pageCount: -1,
    history: [{
        date: new Date(2023, 10, 30),
        currentPage: 0
    }],
    isFavorite: false,
    isCompleted: false,
    memorandum: 'メモです1'
  }

	it('レンダリング', async () => {
		render(RegisteredContent, {bookInfo});

		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText(bookInfo.title!)).toBeInTheDocument();
		expect(screen.getByText(bookInfo.author?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText(`${bookInfo.pageCount!}ページ`)).toBeInTheDocument();
		expect(screen.getByText(convertDate(bookInfo.history[0].date))).toBeInTheDocument();
		expect(screen.getByDisplayValue(bookInfo.memorandum)).toBeInTheDocument();
	});

  it('読んだ記録を追加できること', async () => {
    const { container } = render(RegisteredContent, {bookInfo});

    const dateInput = container.querySelector<HTMLInputElement>('#readingDate');
    const countInput = screen.getByTestId('countInput');
    const btnAdd = screen.getByRole('button');

    //userEventだと日付をいじれないのでJSで
    dateInput!.value = '2023-05-01'
    await userEvent.type(countInput, '50');
    await fireEvent.click(btnAdd);

    expect(screen.getByText('2023/6/1')).toBeInTheDocument();
    expect(screen.getByText('50ページ')).toBeInTheDocument();
});

  it('値が不正な場合に、読んだ記録を追加できないこと', async () => {
    const { container } = render(RegisteredContent, {bookInfo});

    const dateInput = container.querySelector<HTMLInputElement>('#readingDate');
    const countInput = screen.getByTestId('countInput');
    const btnAdd = screen.getByRole('button');

    //表示はされているが検知できない
    // dateInput!.value = ''
    // await fireEvent.click(btnAdd);
    // expect(screen.getByText('日付が未入力です')).toBeInTheDocument();

    dateInput!.value = '2023-05-01'
    await userEvent.type(countInput, '-1');
    await fireEvent.click(btnAdd);
    expect(screen.getByText('ページ数が不正です')).toBeInTheDocument();
  });

  it('メモ欄を更新した際に、書誌情報の値が同期していること', async () => {
    render(RegisteredContent, {bookInfo});

    const memoInput = screen.getByTestId<HTMLInputElement>('memoInput');
    await userEvent.type(memoInput, 'test');

    expect(memoInput.value).toEqual(bookInfo.memorandum);
  });
});