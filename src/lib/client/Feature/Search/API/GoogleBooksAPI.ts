import { PUBLIC_BOOKSAPI_KEY, PUBLIC_BOOKSAPI_LIST } from '$env/static/public';
import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
import type { books_v1 } from 'googleapis';

const requestSearch = async (queries: string[], maxResults: number, startIndex: number) => {
	const params = {
		key: PUBLIC_BOOKSAPI_KEY,
		q: queries.join('+'),
		maxResults: maxResults.toString(),
		startIndex: startIndex.toString()
	};
	const response = await fetch(createUrlWithParams(PUBLIC_BOOKSAPI_LIST, params));

	return (await response.json()) as books_v1.Schema$Volumes;
};

export const requestByFuzzyQuery = async (
	query: string,
	maxResults: number,
	startIndex: number
) => {
	if (!query) {
		throw new Error('検索条件が入力されていません。');
	}

	const result = await requestSearch([query], maxResults, startIndex);
	if (result.totalItems === 0 || !result.items) {
		throw new Error('検索条件に合う書誌情報が見つかりませんでした。');
	}

	return result;
};

export const requestByQueries = async (
	booktitle: string,
	author: string,
	isbn_13: string,
	maxResults: number,
	startIndex: number
) => {
	const queries: string[] = [];
	booktitle && queries.push(`intitle:${booktitle}`);
	author && queries.push(`inauthor:${author}`);
	isbn_13 && queries.push(`isbn:${isbn_13}`);

	if (queries.length === 0) {
		throw new Error('検索条件が入力されていません。');
	}

	const result = await requestSearch(queries, maxResults, startIndex);
	if (result.totalItems === 0 || !result.items) {
		throw new Error('検索条件に合う書誌情報が見つかりませんでした。');
	}

	return result;
};
