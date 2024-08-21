import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import BookCase from '$lib/client/UI/Shared/Icons/BookCase.svelte';
import BookShelf from '$lib/client/UI/Shared/Icons/BookShelf.svelte';
import Home from '$lib/client/UI/Shared/Icons/Home.svelte';
import MagnifingGlass from '$lib/client/UI/Shared/Icons/MagnifingGlass.svelte';
import type { ComponentType } from 'svelte';

interface menuItem {
	ref: string;
	name: string;
}

interface mainMenuItem extends menuItem {
	icon?: ComponentType;
}

export const mainMenuItems: mainMenuItem[] = [
	{ icon: Home, ref: '/home', name: 'ホーム' },
	{ icon: BookCase, ref: '/books', name: 'ライブラリ' },
	{ icon: MagnifingGlass, ref: '/books/search', name: '書籍検索' },
	{ icon: BookShelf, ref: '/shelf', name: '本棚' }
];

export const booksMenuItems: menuItem[] = [
	{ ref: '/books', name: '全ての本' },
	{ ref: '/books/wish', name: '読みたい' },
	{ ref: '/books/reading', name: '読んでいる' },
	{ ref: '/books/complete', name: '読み終わった' }
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
