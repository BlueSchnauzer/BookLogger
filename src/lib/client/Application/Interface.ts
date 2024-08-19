import type { bookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { bookSearchView } from '$lib/client/Application/Views/BookSearch';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { BookSearch } from '$lib/client/Domain/Entities/BookSearch';

export interface BookInfoResponseItem {
	entity: BookInfo;
	view: ReturnType<typeof bookInfoView>;
}

export interface BookInfoUseCaseResult {
	items: BookInfoResponseItem[] | undefined;
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
