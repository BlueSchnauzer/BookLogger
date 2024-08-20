import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { bookInfoView } from '$lib/client/Application/Views/BookInfo';
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
			handleExpectString(view.getTitleLabel(), bookInfo.title);
			bookInfo.title = '';
			handleExpectString(view.getTitleLabel(), 'データ無し');
			bookInfo.title = undefined as unknown as string;
			handleExpectString(view.getTitleLabel(), 'データ無し');
		});
	});

	describe('pageCountLabel', () => {
		it('get label', () => {
			handleExpectString(view.getPageCountLabel(), '300ページ');
			bookInfo.pageCount = 0;
			handleExpectString(view.getPageCountLabel(), '0ページ');
			bookInfo.pageCount = undefined as unknown as number;
			handleExpectString(view.getPageCountLabel(), '0ページ');
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
			expect(view.getProgressByPercent()).toBe('3%');
		});
	});

	describe('getDateLabel', () => {
		it('get label by type', () => {
			handleExpectRegExp(view.getDateLabel('create', true), /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpectRegExp(view.getDateLabel('update', true), /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpectRegExp(view.getDateLabel('complete', true), /データ無し/);
			handleExpectRegExp(view.getDateLabel('create', false), /^\d{1,2}\/\d{1,2}$/);
		});
	});

	describe('getTypeForBottomLabel', () => {
		it('get label by type', () => {
			handleExpectString(view.getTypeForBottomLabel('/home'), 'progress');
			handleExpectString(view.getTypeForBottomLabel('/books'), 'createDate');
			handleExpectString(view.getTypeForBottomLabel('/books/wish'), 'createDate');
			handleExpectString(view.getTypeForBottomLabel('/books/reading'), 'progress');
			handleExpectString(view.getTypeForBottomLabel(''), 'completeDate');
		});
	});

	describe('maxPageCountFromHistory', () => {
		it('get', () => {
			expect(view.getMaxPageCountFromHistory()).toBe(10);
		});
	});
});
