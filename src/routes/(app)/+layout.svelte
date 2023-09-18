<script lang="ts">
	import type { LayoutData } from '../$types';
	import SideMenuItem from './SideMenuItem.svelte';
	import type { ListItemData } from '$lib/customTypes';
	import Hamburger from '$lib/icons/Hamburger.svelte';
	import LeanBooks from '$lib/icons/LeanBooks.svelte';
	import Dashboard from '$lib/icons/Dashboard.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';

	//export let data: LayoutData;

	const listItemDatas: ListItemData[] = [
		{ icon: Dashboard, ref: '/dashboard', name: 'ダッシュボード' },
		{ icon: BookCase, ref: '/books', name: '登録した本' },
		{ icon: PileOfBooks, ref: '/books/wish', name: '読みたい本' },
		{ icon: Openingbook, ref: '/books/reading', name: '読んでいる本' },
		{ icon: CompleteBook, ref: '/books/complete', name: '読み終わった本' },
		{ icon: BookShelf, ref: '/shelfs', name: '本棚' }
	];
	const colorStone200 = '#E7E5E4';

</script>

<div class="flex flex-col w-screen h-screen">
	<div class="flex w-full h-full">
		<nav class="max-md:hidden m-2 w-[250px] rounded-xl shadow-2xl bg-stone-700">
			<div class="flex p-3">
				<LeanBooks color={colorStone200}/>
				<p class="ml-2.5 text-xl text-stone-200">BookLogger</p>
			</div>
			<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
			<ul>
				{#each listItemDatas as data (data.name)}
					<SideMenuItem listItemData={data} iconColor={colorStone200}/>
				{/each}
			</ul>
		</nav>
		<div class="flex-1">
			<slot />
		</div>
	</div>
	<nav class="hidden max-md:block w-full fixed bottom-0 h-16 bg-stone-700">
		<ul>
		</ul>
	</nav>
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>