import { PUBLIC_BOOKSAPI_KEY, PUBLIC_BOOKSAPI_LIST } from '$env/static/public';
import type { books_v1 } from 'googleapis';

const search = async (queries: string[], maxResults: number, startIndex: number) => {
	const response = await fetch(
		createUrl({
			q: queries.join('+'),
			maxResults: maxResults.toString(),
			startIndex: startIndex.toString()
		})
	);

	return (await response.json()) as books_v1.Schema$Volumes;
};

const searchByFuzzyQuery = async (query: string, maxResults: number, startIndex: number) => {
	if (!query) {
		throw new Error('検索条件が入力されていません。');
	}

	const fuzzyQuery: string[] = [];
	fuzzyQuery.push(query);

	const result = await search(fuzzyQuery, maxResults, startIndex);
	if (result.totalItems === 0 || !result.items) {
		throw new Error('検索条件に合う書誌情報が見つかりませんでした。');
	}

	return result;
};

const searchByQueries = async (
	booktitle: string,
	author: string,
	isbn_13: string,
	maxResults: number,
	startIndex: number
) => {
	const queries: string[] = [];
	if (booktitle) {
		queries.push(`intitle:${booktitle}`);
	}
	if (author) {
		queries.push(`inauthor:${author}`);
	}
	if (isbn_13) {
		queries.push(`isbn:${isbn_13}`);
	}

	if (queries.length === 0) {
		throw new Error('検索条件が入力されていません。');
	}

	const result = await search(queries, maxResults, startIndex);
	if (result.totalItems === 0 || !result.items) {
		throw new Error('検索条件に合う書誌情報が見つかりませんでした。');
	}

	return result;
};

const createUrl = (params: Record<string, string>) => {
	const searchParams = new URLSearchParams(params);
	searchParams.append('key', PUBLIC_BOOKSAPI_KEY);

	return `${PUBLIC_BOOKSAPI_LIST}?${searchParams.toString()}`;
};
