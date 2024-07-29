import type { books_v1 } from 'googleapis';

export type BookSearchResultType = books_v1.Schema$Volume;

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
