import { describe, expect, it } from "vitest";
import { type industryIdentifiers, getIdentifier } from "$lib/client/Helpers/GoogleBooksAPI";

describe('GoogleBooksAPI', () => {
  it('getIdentifiers', () => {
    const handleExpect = (isbns: industryIdentifiers, type: 'ISBN_13' | 'ISBN_10', expectValue: string) => {
      const identifiers = getIdentifier(isbns);

      const isbn = type === 'ISBN_13' ? identifiers?.isbn_13 : identifiers?.isbn_10;
      expect(isbn).toBe(expectValue);
    }

    const isbn13 = [{ identifier: '978-4-15-120051-9', type: 'ISBN_13' }];
    handleExpect(isbn13, 'ISBN_13', isbn13[0].identifier);
    const isbn10 = [{ identifier: '4-123456-78-9', type: 'ISBN_10' }];
    handleExpect(isbn10, 'ISBN_10', isbn10[0].identifier);
  });
})
