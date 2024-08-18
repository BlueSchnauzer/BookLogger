<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Helpers/Svelte/ContextAPI';
	import { pageTitles } from '$lib/client/UI/Shared/DisplayData';
	import { emptyMessages } from '$lib/client/UI/Shared/StaticValues';
	import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import OpeningBook from '$lib/icons/OpeningBook.svelte';
	import BooksMainContent from '../BooksMainContent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	setPathNameContext($page.url.pathname);

	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	];
	const selectFilterItems: selectFilterItem[] = [{ id: 1, text: '最近追加した順' }];
</script>

<svelte:head>
	<title>{pageTitles.reading}</title>
</svelte:head>

<BooksMainContent
	headerIcon={OpeningBook}
	headerText={pageTitles.reading}
	items={data.items}
	{toggleFilterItems}
	{selectFilterItems}
	emptyMessage={emptyMessages.reading}
/>
