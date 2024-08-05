import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { bookInfoView } from '$lib/client/Logics/BookInfo/View';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { beforeEach, describe, expect, it } from 'vitest';

const handleExpectString = (actualValue: string, expectValue: string) => {
	expect(actualValue).toBe(expectValue);
};
const handleExpectBoolean = (actualValue: boolean, expectValue: boolean) => {
	expect(actualValue).toBe(expectValue);
};
const handleExpectRegExp = (actualValue: string, expectValue: RegExp) => {
	expect(actualValue).toMatch(expectValue);
};

describe('bookinfo view', () => {
	let bookInfo: BookInfo;
	let view: ReturnType<typeof bookInfoView>;
	beforeEach(() => {
		bookInfo = structuredClone(bookInfoInterfaceMock);
		view = bookInfoView(bookInfo);
	});

	describe('titleLabel', () => {
		it('get label', () => {
			handleExpectString(view.titleLabel(), bookInfo.title);
			bookInfo.title = '';
			handleExpectString(view.titleLabel(), 'データ無し');
			bookInfo.title = undefined as unknown as string;
			handleExpectString(view.titleLabel(), 'データ無し');
		});
	});

	describe('pageCountLabel', () => {
		it('get label', () => {
			handleExpectString(view.pageCountLabel(), '300ページ');
			bookInfo.pageCount = 0;
			handleExpectString(view.pageCountLabel(), '0ページ');
			bookInfo.pageCount = undefined as unknown as number;
			handleExpectString(view.pageCountLabel(), '0ページ');
		});
	});

	describe('isDisplayableProgress', () => {
		it('get', () => {
			handleExpectBoolean(view.isDisplayableProgress(), true);
		});

		it('falthy pageCount', () => {
			bookInfo.pageCount = 0;
			handleExpectBoolean(view.isDisplayableProgress(), false);
		});

		it('falthy pageHistory length', () => {
			bookInfo.pageHistories = undefined;
			handleExpectBoolean(view.isDisplayableProgress(), false);
			bookInfo.pageHistories = [];
			handleExpectBoolean(view.isDisplayableProgress(), false);
		});
	});

	describe('progressByPercent', () => {
		it('get percent', () => {
			expect(view.progressByPercent()).toBe('3%');
		});
	});

	describe('getDateLabel', () => {
		it('get label by type', () => {
			handleExpectRegExp(view.dateLabel('create', true), /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpectRegExp(view.dateLabel('update', true), /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpectRegExp(view.dateLabel('complete', true), /データ無し/);
			handleExpectRegExp(view.dateLabel('create', false), /^\d{1,2}\/\d{1,2}$/);
		});
	});

	describe('getTypeForBottomLabel', () => {
		it('get label by type', () => {
			handleExpectString(view.typeForBottomLabel('/home'), 'progress');
			handleExpectString(view.typeForBottomLabel('/books'), 'createDate');
			handleExpectString(view.typeForBottomLabel('/books/wish'), 'createDate');
			handleExpectString(view.typeForBottomLabel('/books/reading'), 'progress');
			handleExpectString(view.typeForBottomLabel(''), 'completeDate');
		});
	});

	describe('maxPageCountFromHistory', () => {
		it('get', () => {
			expect(view.maxPageCountFromHistory()).toBe(10);
		});
	});
});
