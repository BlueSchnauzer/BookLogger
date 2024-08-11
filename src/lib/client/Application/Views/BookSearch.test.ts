import type { BookSearch } from '$lib/client/Domain/Entities/BookSearch';
import { bookSearchView } from '$lib/client/Application/Views/BookSearch';
import { bookSearchInterfaceMock } from '$lib/mock/Data';
import { beforeEach, describe, expect, it } from 'vitest';

describe('bookinfo view', () => {
	let bookSearch: BookSearch;
	let view: ReturnType<typeof bookSearchView>;
	beforeEach(() => {
		bookSearch = structuredClone(bookSearchInterfaceMock);
		view = bookSearchView(bookSearch);
	});

	describe('titleLabel', () => {
		it('get label', () => {
			const noPropsView = bookSearchView({});

			expect(view.getTitleLabel()).toBe(bookSearch.title);
			expect(noPropsView.getTitleLabel()).toBe('データ無し');
		});
	});

	describe('joinAuthorNames', () => {
		it('get names', () => {
			expect(view.joinUpToFiveAuthorNames()).toBe(bookSearch.authors![0]);
		});
	});

	describe('joinUpToFiveAuthorNames', () => {
		it('get names', () => {
			expect(view.joinUpToFiveAuthorNames()).toBe(bookSearch.authors![0]);
		});
	});

	describe('pageCountLabel', () => {
		it('get label', () => {
			const noPropsView = bookSearchView({});

			expect(view.getPageCountLabel()).toBe(`${bookSearch.pageCount}ページ`);
			expect(noPropsView.getPageCountLabel()).toBe('0ページ');
		});
	});
});
