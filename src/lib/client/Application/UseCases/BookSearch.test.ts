import type { IBookSearchRepository } from '$lib/client/Domain/Repositories/IBookSearch';
import { BookSearchGoogleBooksAPI } from '$lib/client/Infrastructure/GoogleBooksAPI/BookSearch';
import { getEntityTestData } from '$lib/mock/Data';
import type { books_v1 } from 'googleapis';
import { describe, expect, it } from 'vitest';
import { BookSearchUseCase } from '$lib/client/Application/UseCases/BookSearch';

describe('BookSearchUseCase', () => {
	const testData = getEntityTestData();
	//ひとまずGAPIでの実装を利用
	const repos: IBookSearchRepository<books_v1.Schema$Volumes> = new BookSearchGoogleBooksAPI();

	it('searcyByFuzzyQuery', async () => {
		const usecase = new BookSearchUseCase(repos);
		const view = await usecase.searcyByFuzzyQuery('イシグロカズオ');

		expect(view).toBeDefined();
		expect(view.searchResult).toBeDefined();
	});

	it('searchByQueries', async () => {
		const usecase = new BookSearchUseCase(repos);
		const view = await usecase.searchByQueries(
			testData.title,
			testData.author[0],
			testData.identifiers?.value.isbn_13!
		);

		expect(view).toBeDefined();
		expect(view.searchResult).toBeDefined();
	});
});
