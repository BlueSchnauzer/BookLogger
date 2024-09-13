import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { expect, describe, it } from 'vitest';
import {
	getTitleLabel,
	joinAuthorNames,
	getPageCountLabel,
	isDisplayableProgress,
	getProgressByPercent,
	getDateLabel,
	getTypeForBottomLabel
} from '$lib/client/Feature/Contents/DataView/dataView';

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
