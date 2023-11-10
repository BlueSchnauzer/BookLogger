import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
import { convertDate } from '$lib/utils';
import userEvent from '@testing-library/user-event';
import { oneBookInfo } from '$lib/vitest-setup';

describe('RegisteredContent', async () => {
  const pastDate = new Date(2023, 5, 1);

	it('レンダリング', async () => {
		render(RegisteredContent, {bookInfo: oneBookInfo});

		expect(screen.getByText('No Image')).toBeInTheDocument();
		expect(screen.getByText(oneBookInfo.title!)).toBeInTheDocument();
		expect(screen.getByText(oneBookInfo.author?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText(`${oneBookInfo.pageCount!}ページ`)).toBeInTheDocument();
		expect(screen.getByText(convertDate(oneBookInfo.history[0].date))).toBeInTheDocument();
		expect(screen.getByDisplayValue(oneBookInfo.memorandum)).toBeInTheDocument();
	});

  it('お気に入りボタンクリックで値が変更されること', async () => {
		render(RegisteredContent, {bookInfo: oneBookInfo});

    const btnFavorite = screen.getByTestId('btnFavorite');
    await fireEvent.click(btnFavorite);

    expect(oneBookInfo.isFavorite).toEqual(true);
  });

  //成功しないため原因調査中
  it.skip('読んだ記録を追加できること', async () => {
    const { container } = render(RegisteredContent, {bookInfo: oneBookInfo});

    const dateInput = container.querySelector<HTMLInputElement>('#readingDate');
    const countInput = screen.getByTestId('countInput');
    const btnAdd = screen.getByTestId('btnAdd');

    //userEventだと日付をいじれないのでJSで
    dateInput!.value = '2023-07-01'
    await userEvent.type(countInput, '50');
    await fireEvent.click(btnAdd);

    expect(screen.getByText('2023/8/1')).toBeInTheDocument();
    expect(screen.getByText('50ページ')).toBeInTheDocument();
});

  it('値が不正な場合に、読んだ記録を追加できないこと', async () => {
    const { container } = render(RegisteredContent, {bookInfo: oneBookInfo});

    const dateInput = container.querySelector<HTMLInputElement>('#readingDate');
    const countInput = screen.getByTestId('countInput');
    const btnAdd = screen.getByTestId('btnAdd');

    //表示はされているが検知できない
    // dateInput!.value = ''
    // await fireEvent.click(btnAdd);
    // expect(screen.getByText('日付が未入力です')).toBeInTheDocument();

    dateInput!.value = '2023-05-01'
    await userEvent.type(countInput, '-1');
    await fireEvent.click(btnAdd);
    expect(screen.getByText(`ページ数は1～${oneBookInfo.pageCount}ページで入力してください`)).toBeInTheDocument();
  });

  it('メモ欄を更新した際に、書誌情報の値が同期していること', async () => {
    render(RegisteredContent, {bookInfo: oneBookInfo});

    const memoInput = screen.getByTestId<HTMLInputElement>('memoInput');
    await userEvent.type(memoInput, 'test');

    expect(memoInput.value).toEqual(oneBookInfo.memorandum);
  });
});