import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';

export type SearchPromise = () => Promise<{ totalCount: number; items: BookSearch[] | undefined }>;

export type SearchType = 'none' | 'fuzzy' | 'detail';

export interface SearchConditions {
	query: string | null;
	bookTitle: string | null;
	author: string | null;
	isbn: string | null;
}

export interface SearchProps {
	searchType: SearchType;
	searchConditions: SearchConditions;
	pageCount: number;
	startIndex: number;
}
