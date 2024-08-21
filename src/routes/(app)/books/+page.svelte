<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Helpers/Svelte/ContextAPI';
	import { pageTitles } from '$lib/client/Static/DisplayValues';
	import BookCase from '$lib/client/UI/Shared/Icons/BookCase.svelte';
	import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import type { PageData } from './$types';
	import BooksMainContent from './BooksMainContent.svelte';

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
	<title>{pageTitles.books}</title>
</svelte:head>

<BooksMainContent
	headerIcon={BookCase}
	headerText={pageTitles.books}
	items={data.items}
	isBooksRoute={true}
	{toggleFilterItems}
	{selectFilterItems}
/>
