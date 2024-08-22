import type { SearchType } from '$lib/client/Utils/types';

export interface SearchProps {
	searchType: SearchType;
	searchConditions: SearchConditions;
	pageCount: number;
	startIndex: number;
}

export interface SearchConditions {
	query: string;
	bookTitle: string;
	author: string;
	isbn: string;
}
