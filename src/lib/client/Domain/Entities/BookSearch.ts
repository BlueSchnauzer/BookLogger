import type { books_v1 } from 'googleapis';

export interface BookSearch {
	readonly keyId?: string;
	readonly title?: string;
	readonly authors?: string[];
	readonly publisher?: string;
	readonly publishedDate?: string;
	readonly pageCount?: number;
	readonly thumbnail?: string;
	readonly description?: string;
	readonly industryIdentifiers?:
		| {
				identifier?: string | undefined;
				type?: string | undefined;
		  }[]
		| undefined;
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

export const convertResponseToBookSearch = <
	ResultType extends BookSearchResultType<BookSearchResultListType>
>(
	response: ResultType
) => {
	const bookSearch: BookSearch = {
		keyId: response.id!,
		title: response.volumeInfo?.title,
		authors: response.volumeInfo?.authors,
		publisher: response.volumeInfo?.publisher,
		publishedDate: response.volumeInfo?.publishedDate,
		pageCount: response.volumeInfo?.pageCount,
		thumbnail: response.volumeInfo?.imageLinks?.thumbnail,
		description: response.volumeInfo?.description,
		industryIdentifiers: response.volumeInfo?.industryIdentifiers
	};

	return bookSearch;
};
