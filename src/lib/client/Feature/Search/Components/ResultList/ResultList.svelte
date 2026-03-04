<script lang="ts">
	import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
	import ListItem from '$lib/client/Feature/Search/Components/ResultList/ListItem.svelte';
	import type { SearchType } from '$lib/client/Feature/Search/Components/SearchFeature/Interface';

	interface Props {
		searchResultPromise: Promise<{ totalCount: number; items: BookSearch[] | undefined }>;
		searchType: SearchType;
		handleClick: (bookSearch: BookSearch) => void;
	}

	let { searchResultPromise, searchType, handleClick }: Props = $props();
</script>

{#if searchType !== 'none'}
	{#await searchResultPromise}
		<div data-testid="searchLoader" class="flex flex-1 justify-center items-center">
			<span
				class="animate-spin w-14 h-14 border-4 border-lime-600 rounded-full border-t-transparent"
			></span>
		</div>
	{:then response}
		{#if response.items}
			<ul data-testid="resultList">
				{#each response.items as result (result.keyId)}
					<ListItem bookSearch={result} {handleClick} />
				{/each}
			</ul>
		{/if}
	{:catch error}
		<p class="px-1 font-medium text-red-500">{error.message}</p>
	{/await}
{:else}
	<p class="px-1 font-medium text-lime-700">検索条件を入力してください。</p>
{/if}
