import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PagingLabel from '$lib/components/search/parts/PagingLabel.svelte';

describe('PagingLabel', () => {
	it('レンダリング', () => {
		render(PagingLabel, {bookTitle: '', author: '', isbn: '', page: 0, startIndex: 0, resultCount: 30});

		expect(screen.getByTitle('前へ')).toBeInTheDocument();
		expect(screen.getByTitle('次へ')).toBeInTheDocument();
		expect(screen.getByText('1～10/30件')).toBeInTheDocument();
	});

	it('isLoadingがTruethyな場合にボタンが操作できないこと', async () => {
		render(PagingLabel, {bookTitle: '', author: '', isbn: '', page: 0, startIndex: 0, resultCount: 30, isLoading: true});

		expect(screen.getByTitle('前へ')).toHaveAttribute('disabled');
		expect(screen.getByTitle('次へ')).toHaveAttribute('disabled');
	});

	it('isBottomとisLoadingがTruethyな場合に、レンダリングされないこと', () => {
		const {container} = render(PagingLabel, {bookTitle: '', author: '', isbn: '', page: 0, startIndex: 0, resultCount: 30, isBottom: true, isLoading: true});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});
});
