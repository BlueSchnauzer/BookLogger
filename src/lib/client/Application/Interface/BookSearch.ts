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
