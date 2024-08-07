import type { SearchPromise } from '$lib/client/Application/Interface';
import { BookSearchUseCase } from '$lib/client/Application/UseCases/BookSearch';
import { BookSearchGoogleBooksAPI } from '$lib/client/Infrastructure/GoogleBooksAPI/BookSearch';
import type { searchConditions, SearchType } from '$lib/client/Utils/types';
import type { PageLoad, PageLoadEvent } from './$types';

export const load = (async (params) => {
	const maxResults = 10;
	const pageCount = getPageCount(params);
	const startIndex = getStartIndex(maxResults, pageCount);
	const searchConditions = getSearchConditions(params);

	const { searchType, searchPromise } = getSearchTypeAndPromise(
		maxResults,
		startIndex,
		searchConditions
	);

	return {
		searchPromise,
		searchProps: { searchType, searchConditions, pageCount, startIndex }
	};
}) satisfies PageLoad;

const getParamValue = (params: PageLoadEvent, name: string) => {
	return params.url.searchParams.get(name);
};

const getPageCount = (params: PageLoadEvent) => {
	const pageCount = Number(getParamValue(params, 'page'));
	return pageCount >= 0 ? pageCount : 0;
};

const getStartIndex = (maxResults: number, pageCount: number) => {
	return pageCount > 0 ? pageCount * maxResults : 0;
};

const getSearchConditions = (params: PageLoadEvent): searchConditions => {
	//あいまい検索時のみ取得(form送信時にタグがdisabledに設定)
	const query = getParamValue(params, 'query');
	//詳細検索時のみ取得
	const bookTitle = getParamValue(params, 'booktitle');
	const author = getParamValue(params, 'author');
	const isbn = getParamValue(params, 'isbn');

	return { query, bookTitle, author, isbn };
};

const getSearchTypeAndPromise = (
	maxResults: number,
	startIndex: number,
	searchConditions: searchConditions
) => {
	const { query, bookTitle, author, isbn } = searchConditions;

	let searchType: SearchType;

	const repos = new BookSearchGoogleBooksAPI();
	const usecase = BookSearchUseCase(repos);
	//usecaseの検索処理を実行し結果を返す非同期関数。実行自体は+page.svelteで行う。
	let searchPromise: SearchPromise;

	if (query) {
		searchType = 'fuzzy';
		searchPromise = async () => usecase.searcyByFuzzyQuery(query!, maxResults, startIndex);
	} else if (bookTitle || author || isbn) {
		searchType = 'detail';
		searchPromise = async () =>
			usecase.searchByQueries(bookTitle!, author!, isbn!, maxResults, startIndex);
	} else {
		//初回表示時
		searchType = 'none';
		searchPromise = async () =>
			new Promise((resolve) => resolve({ totalItems: 0, result: undefined }));
	}

	return { searchType, searchPromise };
};
