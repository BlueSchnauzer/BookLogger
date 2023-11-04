<script lang="ts">
	import { page } from '$app/stores';
    import Icon from '@iconify/svelte';
	import type { menuItemData } from '$lib/customTypes';
	import Dashboard from '$lib/icons/Dashboard.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';

	const MenuItemDatas: menuItemData[] = [
		{ icon: Dashboard, ref: '/dashboard', jpName: 'ダッシュボード', enName: 'DashBoard' },
		{ icon: BookCase, ref: '/books', jpName: '登録した本', enName: 'AllBooks' },
		{ icon: PileOfBooks, ref: '/books/wish', jpName: '読みたい本', enName: 'Wish'},
		{ icon: Openingbook, ref: '/books/reading', jpName: '読んでいる本', enName: 'Reading' },
		{ icon: CompleteBook, ref: '/books/complete', jpName: '読み終わった本', enName: 'Complete' },
		{ icon: BookShelf, ref: '/shelfs', jpName: '本棚', enName: 'Shelfs' }
	];
	const colorStone200 = '#E7E5E4';

	let pathName: string;
	$: pathName = $page.url.pathname;	

</script>

<nav class="max-md:hidden m-2 w-56 rounded-xl shadow-2xl bg-stone-700">
	<div class="flex p-3">
		<Icon icon="ph:books-light" width="36" height="36" color={colorStone200}/>
		<p class="ml-2.5 text-xl text-stone-200">BookLogger</p>
	</div>
	<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
	<ul>
		{#each MenuItemDatas as data (data.icon)}
			{#if data.icon === BookShelf}
				<li>
					<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
				</li>
			{/if}

			<li
				class="flex h-14 duration-300 border-l-4 border-transparent hover:border-x-lime-600 hover:bg-stone-600 
				{data.ref === pathName ? 'border-x-lime-600 bg-stone-600 ' : ''}"
			>
				<a href={data.ref} class="flex flex-1 group items-center rounded-md">
					<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
						<svelte:component this={data.icon} color={colorStone200} />
					</div>
					{#if data.icon === BookShelf}
						<div class="ml-2.5 mr-3 flex flex-1 justify-between">
							<span class=" text-stone-200">{data.jpName}</span>
							<Icon icon="ph:arrow-down" width="24" height="24" color={colorStone200}/>
						</div>
					{:else}
						<span class="ml-2.5 text-stone-200">{data.jpName}</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>
