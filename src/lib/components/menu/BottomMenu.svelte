<script lang="ts">
	import { page } from '$app/stores';
	import type { menuItemData } from '$lib/customTypes';
	import Home from '$lib/icons/Home.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';

	//モバイルメニュー(画面サイズが小さい時にサイドメニューと入れ替えで表示)
	
	const MenuItemDatas: menuItemData[] = [
		{ icon: Home, ref: '/home', name: 'Home' },
		{ icon: BookCase, ref: '/books', name: 'AllBooks' },
		{ icon: PileOfBooks, ref: '/books/wish', name: 'Wish' },
		{ icon: Openingbook, ref: '/books/reading', name: 'Reading' },
		{ icon: CompleteBook, ref: '/books/complete', name: 'Complete' },
		{ icon: BookShelf, ref: '/shelf', name: 'Shelf' }
	];
	const colorStone200 = '#E7E5E4';

	//ページ移動の度に対応したページにスタイルを当てる
	let pathName: string;
	$: pathName = $page.url.pathname;
</script>

<nav class="hidden max-md:flex w-full fixed bottom-0 h-16 bg-stone-700">
	<ul class="flex flex-1">
		{#each MenuItemDatas as data (data.icon)}
			<li class="flex flex-1 border-b-4 border-transparent
				{data.ref === pathName ? 'border-y-lime-600 bg-stone-600' : ''}"
			>
				<a href={data.ref} class="flex flex-1 flex-col items-center justify-evenly">
					<svelte:component this={data.icon} color={colorStone200} />
					<span class="text-xs text-stone-200">{data.name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
