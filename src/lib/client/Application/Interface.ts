import type { BookSearch } from '$lib/client/Domain/Entities/BookSearch';
import type { bookSearchView } from '$lib/client/Application/Views/BookSearch';

export interface pageHistoryValidation {
	isError: boolean;
	errorMessage?: string;
}

export interface BookSearchResponseItem {
	entity: BookSearch;
	view: ReturnType<typeof bookSearchView>;
}

/**書誌検索ユースケースのレスポンス定義 */
export interface BookSearchUseCaseResult {
	totalCount: number;
	items: BookSearchResponseItem[] | undefined;
}

/**検索画面での検索用関数の定義 */
export type SearchPromise = () => Promise<BookSearchUseCaseResult>;

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
