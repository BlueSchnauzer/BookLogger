export type SearchType = 'none' | 'fuzzy' | 'detail';
export type BottomLabelType = 'createDate' | 'progress' | 'completeDate';

export interface searchConditions {
	query: string | null;
	bookTitle: string | null;
	author: string | null;
	isbn: string | null;
}
