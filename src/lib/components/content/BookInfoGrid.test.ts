import { render, fireEvent, screen } from '@testing-library/svelte';
import { describe, expect, it, vitest } from 'vitest';
import BookInfoGrid from '$lib/components/content/BookInfoGrid.svelte';
import { threeBookInfos } from '$lib/vitest-setup';

describe('BookInfoGrid', () => {
	it('レンダリング', () => {
		render(BookInfoGrid, {bookInfos: threeBookInfos, emptyMessage: ''});

		expect(screen.getByTitle(threeBookInfos[0].title)).toBeInTheDocument();
		expect(screen.getByTitle(threeBookInfos[1].title)).toBeInTheDocument();
		expect(screen.getByTitle(threeBookInfos[2].title)).toBeInTheDocument();

		//メッセージ確認
	});

		//メッセージが変更できるか

	it('クリックイベントを検知できること', async () => {
    const { component } = render(BookInfoGrid, {bookInfos: threeBookInfos, emptyMessage: ''});
    
    const btns = screen.getAllByRole('button');
    const mock = vitest.fn();

    component.$on('click', mock);
    await fireEvent.click(btns[0]);

    expect(mock).toHaveBeenCalled();
  });
});
