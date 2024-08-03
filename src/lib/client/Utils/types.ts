export type SearchType = 'none' | 'fuzzy' | 'detail';

export interface searchConditions {
	query: string | null;
	bookTitle: string | null;
	author: string | null;
	isbn: string | null;
}
