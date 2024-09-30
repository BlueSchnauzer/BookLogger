import { describe, it, expect } from 'vitest';
import {
	getTitleLabel,
	joinUpToFiveAuthorNames,
	joinAuthorNames,
	getPageCountLabel
} from '$lib/client/Feature/Search/DataView/dataView';

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
