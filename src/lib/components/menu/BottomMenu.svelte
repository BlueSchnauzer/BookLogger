<script lang="ts">
	import { page } from '$app/stores';
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

<nav class="hidden max-md:flex w-full fixed bottom-0 h-16 bg-stone-700">
    <ul class="flex flex-1">
        {#each MenuItemDatas as data (data.icon)}
            <li 
                class="flex flex-1 border-b-4 border-transparent
				{data.ref === pathName ? 'border-y-lime-600 bg-stone-600' : ''}"
            >
                <a href="{data.ref}" class="flex flex-1 flex-col items-center justify-evenly">
                    <svelte:component this={data.icon} color={colorStone200}/>
                    <span class="text-xs text-stone-200">{data.enName}</span>
                </a>
            </li>
        {/each}
    </ul>
</nav>


