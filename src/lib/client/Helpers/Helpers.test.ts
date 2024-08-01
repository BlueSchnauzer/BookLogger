import { describe, expect, it } from 'vitest';
import { convertReadingDateToDate } from '$lib/client/Helpers/Date';
import { type industryIdentifiers, getIdentifier } from '$lib/client/Helpers/GoogleBooksAPI';

describe('Date', () => {
	const year = 2024;
	const month = 7;
	const day = 15;
	const dateString = `${year}-${month}-${day}`;

	it('convertReadingDateToDate', () => {
		const convertedDate = convertReadingDateToDate(dateString);
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
