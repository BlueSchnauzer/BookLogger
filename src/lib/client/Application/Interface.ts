import type { books_v1 } from 'googleapis';

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

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
