import {
	convertResponseToBookSearch,
	type BookSearchResultListType,
	type BookSearchResultType
} from '$lib/client/Domain/Entities/BookSearch';
import type { IBookSearchRepository } from '$lib/client/Domain/Repositories/IBookSearch';

export const BookSearchUseCase = <
	ResultListType extends BookSearchResultListType,
	ResultType extends BookSearchResultType<ResultListType>
>(
	repos: IBookSearchRepository<ResultListType>
) => {
	/**(あいまい検索)検索条件を指定して書誌データを取得する */
	const searcyByFuzzyQuery = async (query: string, maxResults = 10, startIndex = 0) => {
		const response = await repos.searchByFuzzyQuery(query, maxResults, startIndex);

		const totalItems = response.totalItems ?? 0;
		const bookSearches = response.items?.map((item) =>
			convertResponseToBookSearch<ResultType>(item as ResultType)
		);

		return { totalItems, bookSearches };
	};

	/**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
	const searchByQueries = async (
		booktitle: string,
		author: string,
		isbn_13: string,
		maxResults = 10,
		startIndex = 0
	) => {
		const response = await repos.searchByQueries(
			booktitle,
			author,
			isbn_13,
			maxResults,
			startIndex
		);

		const totalItems = response.totalItems ?? 0;
		const bookSearches = response.items?.map((item) =>
			convertResponseToBookSearch<ResultType>(item as ResultType)
		);

		return { totalItems, bookSearches };
	};

	return { searcyByFuzzyQuery, searchByQueries };
};
