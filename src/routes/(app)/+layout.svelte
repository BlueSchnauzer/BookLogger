<script lang="ts">
	import type { LayoutData } from '../$types';
	import SideMenuItem from './SideMenuItem.svelte';
	import BottomMenuItem from './BottomMenuItem.svelte';
	import type { MenuItemData } from '$lib/customTypes';
	import Dashboard from '$lib/icons/Dashboard.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';
	import { onMount, type ComponentType } from 'svelte';

	//export let data: LayoutData;

	const MenuItemDatas: MenuItemData[] = [
		{ icon: Dashboard, ref: '/dashboard', jpName: 'ダッシュボード', enName: 'DashBoard' },
		{ icon: BookCase, ref: '/books', jpName: '登録した本', enName: 'AllBooks' },
		{ icon: PileOfBooks, ref: '/books/wish', jpName: '読みたい本', enName: 'Wish'},
		{ icon: Openingbook, ref: '/books/reading', jpName: '読んでいる本', enName: 'Reading' },
		{ icon: CompleteBook, ref: '/books/complete', jpName: '読み終わった本', enName: 'Complete' },
		{ icon: BookShelf, ref: '/shelfs', jpName: '本棚', enName: 'Shelfs' }
	];
	const colorStone200 = '#E7E5E4';
	let currentMenu: ComponentType;
	$: currentMenu = Dashboard;

	onMount(() => {
		
	});

</script>

<div class="flex flex-col w-screen h-screen">
	<div class="flex w-full h-full">
		<SideMenuItem MenuItemDatas={MenuItemDatas} bind:currentMenu={currentMenu} iconColor={colorStone200}/>
		<div class="flex-1">
			<slot />
		</div>
		<BottomMenuItem MenuItemDatas={MenuItemDatas} bind:currentMenu={currentMenu} iconColor={colorStone200}/>
	</div>
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>