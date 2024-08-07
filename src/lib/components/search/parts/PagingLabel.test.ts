import PagingLabel from '$lib/components/search/parts/PagingLabel.svelte';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('PagingLabel', () => {
	it('レンダリング', () => {
		render(PagingLabel, {
			searchType: 'detail',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30
		});

		expect(screen.getByTitle('前へ')).toBeInTheDocument();
		expect(screen.getByTitle('次へ')).toBeInTheDocument();
		expect(screen.getByText('1～10/30件')).toBeInTheDocument();
	});

	it('isLoadingがTruethyな場合にボタンが操作できないこと', async () => {
		render(PagingLabel, {
			searchType: 'detail',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30,
			isLoading: true
		});

		expect(screen.getByTitle('前へ')).toHaveAttribute('disabled');
		expect(screen.getByTitle('次へ')).toHaveAttribute('disabled');
	});

	it('searchTypeがDetailの場合に、booktitle用inputがレンダリングされ、query用inputがレンダリングされないこと', () => {
		const { container } = render(PagingLabel, {
			searchType: 'detail',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30
		});

		var booktitle = container.querySelector('input[name*=booktitle]');
		var query = container.querySelector('input[name*=query]');
		expect(booktitle).toBeInTheDocument();
		expect(query).not.toBeInTheDocument();
	});

	it('searchTypeがFuzzyの場合に、query用inputがレンダリングされ、booktitle用inputがレンダリングされないこと', () => {
		const { container } = render(PagingLabel, {
			searchType: 'fuzzy',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30
		});

		var query = container.querySelector('input[name*=query]');
		var booktitle = container.querySelector('input[name*=booktitle]');
		expect(query).toBeInTheDocument();
		expect(booktitle).not.toBeInTheDocument();
	});

	it('searchTypeがNoneの場合に、レンダリングされないこと', () => {
		const { container } = render(PagingLabel, {
			searchType: 'none',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30
		});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});

	it('isBottomとisLoadingがTruthyな場合に、レンダリングされないこと', () => {
		const { container } = render(PagingLabel, {
			searchType: 'detail',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30,
			isBottom: true,
			isLoading: true
		});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});

	it('searchTypeがNoneで、isBottomとisLoadingがTruethyな場合に、レンダリングされないこと', () => {
		const { container } = render(PagingLabel, {
			searchType: 'none',
			searchConditions: { query: '', bookTitle: '', author: '', isbn: '' },
			pageCount: 0,
			startIndex: 0,
			resultCount: 30,
			isBottom: true,
			isLoading: true
		});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});
});
