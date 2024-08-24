import PagingLabel from '$lib/client/UI/Search/SearchFeature/PagingLabel.svelte';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { SearchProps } from '$lib/client/UI/Search/SearchFeature/Interface';

describe('PagingLabel', () => {
	it('レンダリング', () => {
		const searchProps: SearchProps = {
			searchType: 'detail',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		render(PagingLabel, { searchProps: searchProps, isLoading: false, resultCount: 30 });

		expect(screen.getByTitle('前へ')).toBeInTheDocument();
		expect(screen.getByTitle('次へ')).toBeInTheDocument();
		expect(screen.getByText('1～10/30件')).toBeInTheDocument();
	});

	it('isLoadingがTruethyな場合にボタンが操作できないこと', async () => {
		const searchProps: SearchProps = {
			searchType: 'detail',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		render(PagingLabel, { searchProps: searchProps, isLoading: true, resultCount: 30 });

		expect(screen.getByTitle('前へ')).toHaveAttribute('disabled');
		expect(screen.getByTitle('次へ')).toHaveAttribute('disabled');
	});

	it('searchTypeがDetailの場合に、booktitle用inputがレンダリングされ、query用inputがレンダリングされないこと', () => {
		const searchProps: SearchProps = {
			searchType: 'detail',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		const { container } = render(PagingLabel, {
			searchProps: searchProps,
			isLoading: false,
			resultCount: 30
		});

		const booktitle = container.querySelector('input[name*=booktitle]');
		const query = container.querySelector('input[name*=query]');
		expect(booktitle).toBeInTheDocument();
		expect(query).not.toBeInTheDocument();
	});

	it('searchTypeがFuzzyの場合に、query用inputがレンダリングされ、booktitle用inputがレンダリングされないこと', () => {
		const searchProps: SearchProps = {
			searchType: 'fuzzy',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		const { container } = render(PagingLabel, {
			searchProps: searchProps,
			isLoading: false,
			resultCount: 30
		});

		const query = container.querySelector('input[name*=query]');
		const booktitle = container.querySelector('input[name*=booktitle]');
		expect(query).toBeInTheDocument();
		expect(booktitle).not.toBeInTheDocument();
	});

	it('searchTypeがNoneの場合に、レンダリングされないこと', () => {
		const searchProps: SearchProps = {
			searchType: 'none',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		const { container } = render(PagingLabel, {
			searchProps: searchProps,
			isLoading: false,
			resultCount: 30
		});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});

	it('isBottomとisLoadingがTruthyな場合に、レンダリングされないこと', () => {
		const searchProps: SearchProps = {
			searchType: 'detail',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		const { container } = render(PagingLabel, {
			searchProps: searchProps,
			isLoading: true,
			resultCount: 30,
			isBottom: true
		});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});

	it('searchTypeがNoneで、isBottomとisLoadingがTruethyな場合に、レンダリングされないこと', () => {
		const searchProps: SearchProps = {
			searchType: 'none',
			searchConditions: { author: '', bookTitle: '', isbn: '', query: '' },
			pageCount: 0,
			startIndex: 0
		};

		const { container } = render(PagingLabel, {
			searchProps: searchProps,
			isLoading: true,
			resultCount: 30,
			isBottom: true
		});

		const element = container.querySelector('div.flex');
		expect(element).toBeNull;
	});
});
