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
}

export const convertGAPIResponseToBookSearch = (response: books_v1.Schema$Volume) => {
	const bookSearch: BookSearch = {
		keyId: response.id!,
		title: response.volumeInfo?.title,
		authors: response.volumeInfo?.authors,
		publisher: response.volumeInfo?.publisher,
		publishedDate: response.volumeInfo?.publishedDate,
		pageCount: response.volumeInfo?.pageCount,
		thumbnail: response.volumeInfo?.imageLinks?.thumbnail,
		description: response.volumeInfo?.description
	};

	return bookSearch;
};
