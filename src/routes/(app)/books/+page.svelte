<script lang="ts">
	import type { PageData } from './$types';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
	import BookCase from '$lib/icons/BookCase.svelte';
	import BooksMainContent from './BooksMainContent.svelte';

	export let data: PageData;

	const pageName = 'ライブラリ';
	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	];
	const selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' },
		{ id: 2, text: '最近読み終わった順' }
	];
</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>

<BooksMainContent 
	headerIcon={BookCase}
	headerText={pageName}
	bookInfos={data.bookInfos}
	isBooksRoute={true}
	{toggleFilterItems}
	{selectFilterItems}
/>
