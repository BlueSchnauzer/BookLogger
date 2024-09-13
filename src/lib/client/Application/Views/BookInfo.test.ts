import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import {
	bookInfoView,
	getDateLabel,
	getPageCountLabel,
	getProgressByPercent,
	getTitleLabel,
	getTypeForBottomLabel,
	isDisplayableProgress,
	joinAuthorNames
} from '$lib/client/Application/Views/BookInfo';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { beforeEach, describe, expect, it } from 'vitest';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';

const handleExpectString = (actualValue: string, expectValue: string) => {
	expect(actualValue).toBe(expectValue);
};
const handleExpectBoolean = (actualValue: boolean, expectValue: boolean) => {
	expect(actualValue).toBe(expectValue);
};
const handleExpectRegExp = (actualValue: string, expectValue: RegExp) => {
	expect(actualValue).toMatch(expectValue);
};

describe('titleLabel', () => {
	it('get label', () => {
		const title = 'title';
		handleExpectString(getTitleLabel(title), title);
		handleExpectString(getTitleLabel(''), 'データ無し');
		handleExpectString(getTitleLabel(), 'データ無し');
	});
});

describe('joinAuthorNames', () => {
	it('get joinAuthorNames', () => {
		const author = ['author'];
		const authors = ['authorA', 'authorB'];
		handleExpectString(joinAuthorNames(author), 'author');
		handleExpectString(joinAuthorNames(authors), 'authorA, authorB');
	});
});

describe('pageCountLabel', () => {
	it('get label', () => {
		handleExpectString(getPageCountLabel(300), '300ページ');
		handleExpectString(getPageCountLabel(0), '0ページ');
	});
});

describe('isDisplayableProgress', () => {
	it('get', () => {
		const pageCount = 300;
		const pageHistories = [new PageHistory({ date: new Date(), pageCount: 10 })];
		handleExpectBoolean(isDisplayableProgress(pageCount, pageHistories), true);
	});

	it('falthy pageCount', () => {
		const pageCount = 0;
		const pageHistories = [new PageHistory({ date: new Date(), pageCount: 10 })];
		handleExpectBoolean(isDisplayableProgress(pageCount, pageHistories), false);
	});

	it('falthy pageHistory length', () => {
		const pageCount = 300;
		let pageHistories = undefined as unknown as PageHistory[];
		handleExpectBoolean(isDisplayableProgress(pageCount, pageHistories!), false);
		pageHistories = [];
		handleExpectBoolean(isDisplayableProgress(pageCount, pageHistories as PageHistory[]), false);
	});
});

describe('progressByPercent', () => {
	it('get percent', () => {
		const pageCount = 300;
		const pageHistories = [new PageHistory({ date: new Date(), pageCount: 10 })];
		expect(getProgressByPercent(pageCount, pageHistories)).toBe('3%');
	});
});

describe('getDateLabel', () => {
	it('get label by type', () => {
		const date = new Date();
		handleExpectRegExp(getDateLabel(date, true), /^\d{4}\/\d{1,2}\/\d{1,2}$/);
		handleExpectRegExp(getDateLabel(date), /^\d{4}\/\d{1,2}\/\d{1,2}$/);
		handleExpectRegExp(getDateLabel(undefined as unknown as Date, true), /データ無し/);
		handleExpectRegExp(getDateLabel(date, false), /^\d{1,2}\/\d{1,2}$/);
	});
});

describe('getTypeForBottomLabel', () => {
	it('get label by type', () => {
		handleExpectString(getTypeForBottomLabel('/home'), 'progress');
		handleExpectString(getTypeForBottomLabel('/books'), 'createDate');
		handleExpectString(getTypeForBottomLabel('/books/wish'), 'createDate');
		handleExpectString(getTypeForBottomLabel('/books/reading'), 'progress');
		handleExpectString(getTypeForBottomLabel(''), 'completeDate');
	});
});

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
