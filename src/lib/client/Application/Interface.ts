import type { books_v1 } from 'googleapis';
import type { BookSearchView } from '$lib/client/Application/Views/BookSearch';

export interface pageHistoryValidation {
	isError: boolean;
	errorMessage?: string;
}

/**書誌検索の検索結果一覧 */
export type BookSearchResultListType = books_v1.Schema$Volumes;
/**書誌検索の検索結果 */
export type BookSearchResultType<T> = T extends books_v1.Schema$Volumes
	? books_v1.Schema$Volume
	: never;

export const isGAPIResultList = (obj: any): obj is books_v1.Schema$Volumes => {
	return 'totalItems' in obj;
};

export const isGAPIResult = (obj: any): obj is books_v1.Schema$Volume => {
	return 'volumeInfo' in obj;
};

/**書誌検索ユースケースのレスポンス定義 */
export interface bookSearchUseCaseResult<
	ResultType extends BookSearchResultType<BookSearchResultListType>
> {
	totalItems: number;
	views: BookSearchView<ResultType>[] | undefined;
}

/**検索画面での検索用関数の定義 */
export type searchPromise<ResultType extends BookSearchResultType<BookSearchResultListType>> =
	() => Promise<bookSearchUseCaseResult<ResultType>>;

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
