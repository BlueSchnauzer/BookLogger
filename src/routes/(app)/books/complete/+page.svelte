<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { emptyMessages, pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import CompleteBook from '$lib/client/Shared/Icons/CompleteBook.svelte';
	import type { PageData } from './$types';
	import ContentsFeature from '$lib/client/Feature/Contents/Components/ContentsFeature/ContentsFeature.svelte';

	export let data: PageData;
	setPathNameContext($page.url.pathname);

	// const toggleFilterItems: toggleFilterItem[] = [
	// 	{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	// ];
	// const selectFilterItems: selectFilterItem[] = [
	// 	{ id: 1, text: '最近追加した順' },
	// 	{ id: 2, text: '最近読み終わった順' }
	// ];
</script>

<svelte:head>
	<title>{pageTitles.complete}</title>
</svelte:head>

<ContentsFeature
	bookInfos={data.bookInfos}
	currentPageCount={data.page}
	lastPageCount={data.lastPageCount}
	emptyMessage={emptyMessages.complete}
/>
