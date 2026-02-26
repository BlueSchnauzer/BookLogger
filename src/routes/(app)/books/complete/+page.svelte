<script lang="ts">
	import { emptyMessages, pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import ContentsFeature from '$lib/client/Feature/Contents/Components/ContentsFeature/ContentsFeature.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{pageTitles.complete}</title>
</svelte:head>

<ContentsFeature
	pageCount={data.pageCount}
	query={data.query}
	order={data.order}
	lastPageCount={data.lastPageCount}
	bookInfos={data.bookInfos}
	emptyMessage={emptyMessages.complete}
/>
