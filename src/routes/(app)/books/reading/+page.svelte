<script lang="ts">
	import { emptyMessages, pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import ContentsFeature from '$lib/client/Feature/Contents/Components/ContentsFeature/ContentsFeature.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// const toggleFilterItems: toggleFilterItem[] = [
	// 	{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	// ];
	// const selectFilterItems: selectFilterItem[] = [{ id: 1, text: '最近追加した順' }];
</script>

<svelte:head>
	<title>{pageTitles.reading}</title>
</svelte:head>

<ContentsFeature
	pageCount={data.pageCount}
	query={data.query}
	order={data.order}
	lastPageCount={data.lastPageCount}
	bookInfos={data.bookInfos}
	emptyMessage={emptyMessages.reading}
/>
