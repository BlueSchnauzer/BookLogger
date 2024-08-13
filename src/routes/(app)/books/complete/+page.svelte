<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Helpers/Context';
	import { pageTitles } from '$lib/client/UI/Shared/DisplayData';
	import { emptyMessages } from '$lib/client/UI/Shared/StaticValues';
	import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BooksMainContent from '../BooksMainContent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	setPathNameContext($page.url.pathname);

	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	];
	const selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' },
		{ id: 2, text: '最近読み終わった順' }
	];
</script>

<svelte:head>
	<title>{pageTitles.complete}</title>
</svelte:head>

<BooksMainContent
	headerIcon={CompleteBook}
	headerText={pageTitles.complete}
	items={data.items}
	{toggleFilterItems}
	{selectFilterItems}
	emptyMessage={emptyMessages.complete}
/>
