import { setContext, getContext } from 'svelte';

export const setPathNameContext = (pathName: string) => setContext('pathName', pathName);
export const getPathNameContext = () => getContext<string>('pathName');

interface BooksUrlInfo {
	pathName: string;
	page: string;
	query: string;
	order: string;
}

export const setBooksUrlInfo = (booksUrlInfo: BooksUrlInfo) =>
	setContext('booksUrlInfo', booksUrlInfo);
export const getBooksUrlInfo = () => getContext<BooksUrlInfo>('booksUrlInfo');
