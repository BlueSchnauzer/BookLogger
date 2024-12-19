import { setContext, getContext } from 'svelte';

export const setPathNameContext = (pathName: string) => setContext('pathName', pathName);
export const getPathNameContext = () => getContext<string>('pathName');

interface BooksUrlInfo {
	pathName: string;
	params: {
		page_count: string;
		query: string;
		order: string;
	};
}

export const setBooksUrlInfoContext = (booksUrlInfo: BooksUrlInfo) =>
	setContext('booksUrlInfo', booksUrlInfo);
export const getBooksUrlInfoContext = () => getContext<BooksUrlInfo>('booksUrlInfo');
