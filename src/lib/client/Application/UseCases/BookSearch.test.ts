import type { IBookSearchRepository } from '$lib/client/Domain/Repositories/IBookSearch';
import { BookSearchGoogleBooksAPI } from '$lib/client/Infrastructure/GoogleBooksAPI/BookSearch';
import type { books_v1 } from 'googleapis';
import { describe, expect, it } from 'vitest';
import { BookSearchUseCase } from '$lib/client/Application/UseCases/BookSearch';
import { bookInfoInterfaceMock } from '$lib/mock/Data';

describe('BookSearchUseCase', () => {
	const testData = bookInfoInterfaceMock;
	//ひとまずGAPIでの実装を利用
	const repos: IBookSearchRepository<books_v1.Schema$Volumes> = new BookSearchGoogleBooksAPI();

	it('searcyByFuzzyQuery', async () => {
		const usecase = BookSearchUseCase(repos);
		const { totalItems, bookSearches } = await usecase.searcyByFuzzyQuery('イシグロカズオ');

		expect(totalItems).toBeGreaterThanOrEqual(0);
		expect(bookSearches).toBeDefined();
		expect(bookSearches?.length).toBeTruthy();
	});

	it('searchByQueries', async () => {
		const usecase = BookSearchUseCase(repos);
		const { totalItems, bookSearches } = await usecase.searchByQueries(
			testData.title,
			testData.author[0],
			testData.identifiers?.value.isbn_13!
		);

		expect(totalItems).toBeGreaterThanOrEqual(0);
		expect(bookSearches).toBeDefined();
		expect(bookSearches?.length).toBeTruthy();
	});
});
