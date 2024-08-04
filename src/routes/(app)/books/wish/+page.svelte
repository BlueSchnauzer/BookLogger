<script lang="ts">
	import { pageTitles } from '$lib/client/UI/Shared/DisplayData';
	import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import BooksMainContent from '../BooksMainContent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	];
	const selectFilterItems: selectFilterItem[] = [{ id: 1, text: '最近追加した順' }];
</script>

<svelte:head>
	<title>{pageTitles.wish}</title>
</svelte:head>

<BooksMainContent
	headerIcon={PileOfBooks}
	headerText={pageTitles.wish}
	bookInfos={data.bookInfos}
	{toggleFilterItems}
	{selectFilterItems}
	emptyMessage={data.emptyMessage}
/>
