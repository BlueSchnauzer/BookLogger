import {
	convertResponseToBookSearch,
	type BookSearchResultListType,
	type BookSearchResultType
} from '$lib/client/Feature/Search/BookSearch';
import {
	requestByFuzzyQuery,
	requestByQueries
} from '$lib/client/Feature/Search/API/GoogleBooksAPI';

export const searchByFuzzyQuery = async <
	ResultListType extends BookSearchResultListType,
	ResultType extends BookSearchResultType<ResultListType>
>(
	query: string,
	maxResults = 10,
	startIndex = 0
) => {
	const response = await requestByFuzzyQuery(query, maxResults, startIndex);

	const totalCount = response.totalItems ?? 0;
	const items = response.items?.map((item) =>
		convertResponseToBookSearch<ResultType>(item as ResultType)
	);

	return { totalCount, items };
};

export const searchByQueries = async <
	ResultListType extends BookSearchResultListType,
	ResultType extends BookSearchResultType<ResultListType>
>(
	booktitle: string,
	author: string,
	isbn_13: string,
	maxResults = 10,
	startIndex = 0
) => {
	const response = await requestByQueries(booktitle, author, isbn_13, maxResults, startIndex);

	const totalCount = response.totalItems ?? 0;
	const items = response.items?.map((item) =>
		convertResponseToBookSearch<ResultType>(item as ResultType)
	);

	return { totalCount, items };
};
