import type { books_v1 } from 'googleapis';

export type BookSearchResultType = books_v1.Schema$Volume;

export const isGAPIResult = (obj: any): obj is books_v1.Schema$Volume => {
	return 'volumeInfo' in obj;
};

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
