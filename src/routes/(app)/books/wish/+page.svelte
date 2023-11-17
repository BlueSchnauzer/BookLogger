<script lang="ts">
  import type { PageData } from './$types';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import BooksMainContent from '../BooksMainContent.svelte';
   
  export let data: PageData;
	const headerIcon = PileOfBooks;
	const headerText = '読みたい本';

	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
	];
	const selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' }
	];

</script>

<BooksMainContent 
	{headerIcon}
	{headerText}
	bookInfos={data.bookInfos}
	{toggleFilterItems}
	{selectFilterItems}
	emptyMessage={data.emptyMessage}
/>
