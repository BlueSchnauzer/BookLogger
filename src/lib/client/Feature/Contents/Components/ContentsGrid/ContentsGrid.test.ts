import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import ContentsGrid from '$lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte';
import { bookInfoResponseItemsMock } from '$lib/mock/Data';

describe('BookInfoGrid', () => {
	const bookInfoResponseItems = bookInfoResponseItemsMock();

	it('レンダリング', () => {
		render(ContentsGrid, { items: bookInfoResponseItems, emptyMessage: '' });

		expect(screen.getByTitle(bookInfoResponseItems[0].entity.title)).toBeInTheDocument();
		expect(screen.getByTitle(bookInfoResponseItems[1].entity.title)).toBeInTheDocument();
		expect(screen.getByTitle(bookInfoResponseItems[2].entity.title)).toBeInTheDocument();

		//メッセージ確認
	});

	//メッセージが変更できるか

	it('クリックイベントを検知できること', async () => {
		const { component } = render(ContentsGrid, { items: bookInfoResponseItems, emptyMessage: '' });

		const btns = screen.getAllByRole('button');
		const mock = vitest.fn();

		component.$on('click', mock);
		await fireEvent.click(btns[0]);

		expect(mock).toHaveBeenCalled();
	});
});
