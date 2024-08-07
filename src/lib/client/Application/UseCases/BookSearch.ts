import {
	convertResponseToBookSearch,
	type BookSearchResultListType,
	type BookSearchResultType
} from '$lib/client/Domain/Entities/BookSearch';
import type { IBookSearchRepository } from '$lib/client/Domain/Repositories/IBookSearch';
import type { BookSearchUseCaseResult } from '../Interface';
import { bookSearchView } from '../Views/BookSearch';

export const BookSearchUseCase = <
	ResultListType extends BookSearchResultListType,
	ResultType extends BookSearchResultType<ResultListType>
>(
	repos: IBookSearchRepository<ResultListType>
) => {
	/**(あいまい検索)検索条件を指定して書誌データを取得する */
	const searcyByFuzzyQuery = async (
		query: string,
		maxResults = 10,
		startIndex = 0
	): Promise<BookSearchUseCaseResult> => {
		const response = await repos.searchByFuzzyQuery(query, maxResults, startIndex);

		const totalItems = response.totalItems ?? 0;
		const result = response.items?.map((item) => {
			const entity = convertResponseToBookSearch<ResultType>(item as ResultType);
			const view = bookSearchView(entity);
			return { entity, view };
		});

		return { totalItems, result };
	};

	/**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
	const searchByQueries = async (
		booktitle: string,
		author: string,
		isbn_13: string,
		maxResults = 10,
		startIndex = 0
	): Promise<BookSearchUseCaseResult> => {
		const response = await repos.searchByQueries(
			booktitle,
			author,
			isbn_13,
			maxResults,
			startIndex
		);

		const totalItems = response.totalItems ?? 0;
		const result = response.items?.map((item) => {
			const entity = convertResponseToBookSearch<ResultType>(item as ResultType);
			const view = bookSearchView(entity);
			return { entity, view };
		});

		return { totalItems, result };
	};

	return { searcyByFuzzyQuery, searchByQueries };
};
