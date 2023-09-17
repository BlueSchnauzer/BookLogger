<script lang="ts">
	import type { LayoutData } from '../$types';
	import ListItem from './ListItem.svelte';
	import type { ListItemData } from '$lib/customTypes';
	import Hamburger from '$lib/icons/Hamburger.svelte';
	import LeanBooks from '$lib/icons/LeanBooks.svelte';
	import Dashboard from '$lib/icons/Dashboard.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BookStand from '$lib/icons/BookStand.svelte';

	//export let data: LayoutData;

	const listItemDatas: ListItemData[] = [
		{ icon: Dashboard, ref: '/dashboard', name: 'ダッシュボード' },
		{ icon: BookCase, ref: '/books', name: '登録した本' },
		{ icon: PileOfBooks, ref: '/books/wish', name: '読みたい本' },
		{ icon: Openingbook, ref: '/books/reading', name: '読んでいる本' },
		{ icon: CompleteBook, ref: '/books/complete', name: '読み終わった本' },
		{ icon: BookStand, ref: '/shelfs', name: '本棚' }
	];
	const colorStone200 = '#E7E5E4';

</script>

<div class="flex flex-col w-screen h-screen">
	<header class="hidden max-md:block w-full bg-orange-200">
		<div class="flex justify-between items-center max-w-5xl mx-auto">
			<button class="ml-5">
				<LeanBooks />
			</button>
			<button class="mr-5">
				<Hamburger />
			</button>
		</div>
	</header>
	<div class="flex w-full h-full">
		<nav class="m-2 w-[250px] rounded-xl shadow-2xl bg-stone-700">
			<div class="flex p-3">
				<LeanBooks color={colorStone200}/>
				<p class="ml-2.5 text-xl text-stone-200">BookLogger</p>
			</div>
			<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
			<ul>
				{#each listItemDatas as data (data.name)}
					<ListItem listItemData={data} iconColor={colorStone200}/>
				{/each}
			</ul>
		</nav>
		<div class="flex-1">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>