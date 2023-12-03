<script lang="ts">
	import type { PageData } from './$types';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
    import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import BooksMainContent from '../BooksMainContent.svelte';

	export let data: PageData;

	const toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	];
	const selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' },
		{ id: 2, text: '最近読み終わった順' }
	];
	
</script>

<BooksMainContent
	headerIcon={CompleteBook}
	headerText={'読み終わった本'}
	bookInfos={data.bookInfos}
	{toggleFilterItems}
	{selectFilterItems}
	emptyMessage={data.emptyMessage}
/>
