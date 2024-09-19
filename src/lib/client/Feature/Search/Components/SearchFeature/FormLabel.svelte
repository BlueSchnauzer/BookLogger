<script lang="ts">
	import { colorLime800 } from '$lib/client/Shared/Constants/DisplayValues';
	import type {
		SearchConditions,
		SearchType
	} from '$lib/client/Feature/Search/Components/SearchFeature/Interface';
	import Icon from '@iconify/svelte';

	export let isLoading = false;
	export let searchType: SearchType;
	export let searchConditions: SearchConditions;
	export let pageCount: number;
	export let direction: 'backward' | 'forward';
	export let onSubmit: (event: SubmitEvent) => void;
</script>

<form action="/books/search" class="flex justify-center" on:submit={onSubmit}>
	<button
		class="hover:bg-stone-300 rounded"
		type="submit"
		title={direction === 'backward' ? '前へ' : '次へ'}
		disabled={isLoading}
	>
		{#if direction === 'backward'}
			<Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
		{:else}
			<Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
		{/if}
	</button>
	{#if searchType === 'fuzzy'}
		<input type="hidden" value={searchConditions.query} name="query" />
	{:else if searchType === 'detail'}
		<input type="hidden" value={searchConditions.bookTitle} name="booktitle" />
		<input type="hidden" value={searchConditions.author} name="author" />
		<input type="hidden" value={searchConditions.isbn} name="isbn" />
	{/if}
	<input type="hidden" bind:value={pageCount} name="page" />
</form>
