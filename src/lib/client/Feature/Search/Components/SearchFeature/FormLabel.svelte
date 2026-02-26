<script lang="ts">
	import { colorLime800 } from '$lib/client/Shared/Constants/DisplayValues';
	import type {
		SearchConditions,
		SearchType
	} from '$lib/client/Feature/Search/Components/SearchFeature/Interface';
	import Icon from '@iconify/svelte';
	import { SearchURLs } from '$lib/client/Shared/Constants/urls';

	interface Props {
		isLoading: boolean;
		searchType: SearchType;
		searchConditions: SearchConditions;
		pageCount: number;
		direction: 'backward' | 'forward';
		onSubmit: (event: SubmitEvent) => void;
	}

	let { isLoading, searchType, searchConditions, pageCount = $bindable(), direction, onSubmit }: Props = $props();
</script>

<form action={SearchURLs.search} class="flex justify-center" onsubmit={onSubmit}>
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
