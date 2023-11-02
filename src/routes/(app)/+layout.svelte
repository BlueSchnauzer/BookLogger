<script lang="ts">
	import type { LayoutData } from '../$types';
	import { page } from '$app/stores';
	import SideMenuItem from '$lib/components/menu/SideMenu.svelte';
	import BottomMenuItem from '$lib/components/menu/BottomMenu.svelte';
	import type { menuItemData } from '$lib/customTypes';
	import Dashboard from '$lib/icons/Dashboard.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';
	import {onMount, type ComponentType } from 'svelte';

	//export let data: LayoutData;

	const MenuItemDatas: menuItemData[] = [
		{ icon: Dashboard, ref: '/dashboard', jpName: 'ダッシュボード', enName: 'DashBoard' },
		{ icon: BookCase, ref: '/books', jpName: '登録した本', enName: 'AllBooks' },
		{ icon: PileOfBooks, ref: '/books/wish', jpName: '読みたい本', enName: 'Wish'},
		{ icon: Openingbook, ref: '/books/reading', jpName: '読んでいる本', enName: 'Reading' },
		{ icon: CompleteBook, ref: '/books/complete', jpName: '読み終わった本', enName: 'Complete' },
		{ icon: BookShelf, ref: '/shelfs', jpName: '本棚', enName: 'Shelfs' }
	];
	const colorStone200 = '#E7E5E4';
	let currentMenu: ComponentType = Dashboard;
	
	onMount(() => {
		currentMenu = MenuItemDatas.find(data => data.ref === $page.url.pathname)?.icon!;
	});

</script>

<div class="flex w-screen h-screen overflow-hidden">
	<SideMenuItem MenuItemDatas={MenuItemDatas} bind:currentMenu={currentMenu} iconColor={colorStone200}/>
	<slot/>
	<BottomMenuItem MenuItemDatas={MenuItemDatas} bind:currentMenu={currentMenu} iconColor={colorStone200}/>
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
	:root {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>