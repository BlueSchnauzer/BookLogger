export interface pageHistoryValidation {
	isError: boolean;
	errorMessage?: string;
}

// /**書誌検索ユースケースのレスポンス定義 */
// export interface bookSearchUseCaseResult<
// 	ResultType extends BookSearchResultType<BookSearchResultListType>
// > {
// 	totalItems: number;
// 	views: BookSearchView<ResultType>[] | undefined;
// }

// /**検索画面での検索用関数の定義 */
// export type searchPromise<ResultType extends BookSearchResultType<BookSearchResultListType>> =
// 	() => Promise<bookSearchUseCaseResult<ResultType>>;

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
