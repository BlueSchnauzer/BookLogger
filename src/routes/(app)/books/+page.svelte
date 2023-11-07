<script lang="ts">
	import type { PageData } from './$types';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
	import BookShelf from '$lib/icons/BookShelf.svelte';
	import BooksMainContent from './BooksMainContent.svelte';

	export let data: PageData;
	const headerIcon = BookShelf;
	const headerText = '登録した本';

	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true },
		{ id: 3, text: '読んでいる', type: 'status', isChecked: false, isVisible: true },
		{ id: 4, text: '読み終わった', type: 'status', isChecked: false, isVisible: true }
	];
	const selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' },
		{ id: 2, text: '最近読み終わった順' }
	];
</script>

<BooksMainContent 
	{headerIcon}
	{headerText}
	bookInfos={data.bookInfos}
	{toggleFilterItems}
	{selectFilterItems}
/>
