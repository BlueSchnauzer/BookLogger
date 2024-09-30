<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { emptyMessages, pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import OpeningBook from '$lib/client/Shared/Icons/OpeningBook.svelte';
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
	<title>{pageTitles.reading}</title>
</svelte:head>

<ContentsFeature
	headerIcon={OpeningBook}
	headerText={pageTitles.reading}
	bookInfos={data.bookInfos}
	emptyMessage={emptyMessages.reading}
/>
