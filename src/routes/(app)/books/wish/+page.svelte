<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	import { emptyMessages } from '$lib/client/Shared/Constants/DisplayValues';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import PileOfBooks from '$lib/client/Shared/Icons/PileOfBooks.svelte';
	import type { PageData } from './$types';
	import ContentsFeature from '$lib/client/Feature/Contents/Components/ContentsFeature/ContentsFeature.svelte';

	export let data: PageData;
	setPathNameContext($page.url.pathname);

	// const toggleFilterItems: toggleFilterItem[] = [
	// 	{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	// ];
	// const selectFilterItems: selectFilterItem[] = [{ id: 1, text: '最近追加した順' }];
</script>

<svelte:head>
	<title>{pageTitles.wish}</title>
</svelte:head>

<ContentsFeature
	bookInfos={data.bookInfos}
	currentPageCount={data.page}
	lastPageCount={data.lastPageCount}
	emptyMessage={emptyMessages.wish}
/>
