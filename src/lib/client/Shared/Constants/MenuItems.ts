import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import BookCase from '$lib/client/Shared/Icons/BookCase.svelte';
import BookShelf from '$lib/client/Shared/Icons/BookShelf.svelte';
import Home from '$lib/client/Shared/Icons/Home.svelte';
import MagnifingGlass from '$lib/client/Shared/Icons/MagnifingGlass.svelte';
import type { ComponentType } from 'svelte';
import { BooksURLs, HomeURLs, SearchURLs } from './urls';

interface menuItem {
	ref: string;
	name: string;
}

interface mainMenuItem extends menuItem {
	icon?: ComponentType;
}

export const mainMenuItems: mainMenuItem[] = [
	{ icon: Home, ref: HomeURLs.home, name: 'ホーム' },
	{ icon: BookCase, ref: BooksURLs.books, name: 'ライブラリ' },
	{ icon: MagnifingGlass, ref: SearchURLs.search, name: '書籍検索' },
	{ icon: BookShelf, ref: '/shelf', name: '本棚' }
];

export const booksMenuItems: menuItem[] = [
	{ ref: BooksURLs.books, name: '全ての本' },
	{ ref: BooksURLs.wish, name: '読みたい' },
	{ ref: BooksURLs.reading, name: '読んでいる' },
	{ ref: BooksURLs.complete, name: '読み終わった' }
];

interface statusItem {
	status: status;
	label: string;
}
export const statusItems: statusItem[] = [
	{ status: 'wish', label: '読みたい本' },
	{ status: 'reading', label: '読んでいる本' },
	{ status: 'complete', label: '読み終わった本' }
];
