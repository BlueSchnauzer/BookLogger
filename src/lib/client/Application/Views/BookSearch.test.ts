import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
import {
	bookSearchView,
	getPageCountLabel,
	getTitleLabel,
	joinAuthorNames,
	joinUpToFiveAuthorNames
} from '$lib/client/Application/Views/BookSearch';
import { bookSearchInterfaceMock } from '$lib/mock/Data';
import { beforeEach, describe, expect, it } from 'vitest';

describe('titleLabel', () => {
	it('get label', () => {
		expect(getTitleLabel('title')).toBe('title');
		expect(getTitleLabel('')).toBe('データ無し');
		expect(getTitleLabel()).toBe('データ無し');
	});
});

describe('joinAuthorNames', () => {
	it('get names', () => {
		const author = ['author'];
		const twoAuthors = ['authorA', 'authorB'];
		const sixAuthors = [...twoAuthors, 'authorC', 'authorD', 'authorE', 'authorF'];
		expect(joinUpToFiveAuthorNames(author)).toBe('author');
		expect(joinUpToFiveAuthorNames(twoAuthors)).toBe('authorA, authorB');
		expect(joinUpToFiveAuthorNames(sixAuthors)).toBe(
			'authorA, authorB, authorC, authorD, authorE...'
		);
	});
});

describe('joinUpToFiveAuthorNames', () => {
	it('get names', () => {
		const author = ['author'];
		const twoAuthors = ['authorA', 'authorB'];
		const sixAuthors = [...twoAuthors, 'authorC', 'authorD', 'authorE', 'authorF'];
		expect(joinAuthorNames(author)).toBe('author');
		expect(joinAuthorNames(twoAuthors)).toBe('authorA, authorB');
		expect(joinAuthorNames(sixAuthors)).toBe(
			'authorA, authorB, authorC, authorD, authorE, authorF'
		);
	});
});

describe('pageCountLabel', () => {
	it('get label', () => {
		expect(getPageCountLabel(300)).toBe(`300ページ`);
		expect(getPageCountLabel(0)).toBe('0ページ');
		expect(getPageCountLabel()).toBe('0ページ');
	});
});

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
