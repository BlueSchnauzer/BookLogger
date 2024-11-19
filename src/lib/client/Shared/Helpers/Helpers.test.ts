import { convertInputDateToDate } from '$lib/client/Shared/Helpers/Date';
import { type industryIdentifiers, getIdentifier } from '$lib/client/Shared/Helpers/GoogleBooksAPI';
import { createUrlWithParams, getPageCount, getParamValue } from '$lib/client/Shared/Helpers/Urls';
import { describe, expect, it } from 'vitest';

describe('Date', () => {
	const year = 2024;
	const month = 7;
	const day = 15;
	const dateString = `${year}-${month}-${day}`;

	it('convertInputDateToDate', () => {
		const convertedDate = convertInputDateToDate(dateString);
		expect(convertedDate.getFullYear()).toEqual(year);
		expect(convertedDate.getMonth()).toEqual(month - 1);
		expect(convertedDate.getDate()).toEqual(day);
	});

	it('getCurrentDateString', () => {});
});

describe('GoogleBooksAPI', () => {
	it('getIdentifiers', () => {
		const handleExpect = (
			isbns: industryIdentifiers,
			type: 'ISBN_13' | 'ISBN_10',
			expectValue: string
		) => {
			const identifiers = getIdentifier(isbns);

			const isbn = type === 'ISBN_13' ? identifiers?.isbn_13 : identifiers?.isbn_10;
			expect(isbn).toBe(expectValue);
		};

		const isbn13 = [{ identifier: '978-4-15-120051-9', type: 'ISBN_13' }];
		handleExpect(isbn13, 'ISBN_13', isbn13[0].identifier);
		const isbn10 = [{ identifier: '4-123456-78-9', type: 'ISBN_10' }];
		handleExpect(isbn10, 'ISBN_10', isbn10[0].identifier);
	});
});

describe('Urls', () => {
	it('createUrlWithParams', () => {
		const url = '/test/slug';
		const params = { key1: 'value1', key2: 'value2', key3: 'value3' };
		const urlWithParams = createUrlWithParams(url, params);

		expect(urlWithParams).toBe(
			`${url}?key1=${params.key1}&key2=${params.key2}&key3=${params.key3}`
		);
	});

	it('getParamValue', () => {
		const param = new URLSearchParams('keyA=valueA&keyB=valueB&keyC=valueC');

		expect(getParamValue(param, 'keyA')).toBe('valueA');
		expect(getParamValue(param, 'keyB')).toBe('valueB');
		expect(getParamValue(param, 'keyC')).toBe('valueC');
	});

	it('getPageCount', () => {
		expect(getPageCount(new URLSearchParams('page=0'))).toBe(0);
		expect(getPageCount(new URLSearchParams('page=100'))).toBe(100);
		expect(getPageCount(new URLSearchParams('page=test'))).toBe(0);
		expect(getPageCount(new URLSearchParams('key=value'))).toBe(0);
	});
});
