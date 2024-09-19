<script lang="ts">
	import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
	import type { SearchPromise } from '$lib/client/Feature/Search/interface';
	import ListItem from '$lib/client/UI/Search/ResultList/ListItem.svelte';
	import type { SearchType } from '$lib/client/UI/Search/SearchFeature/Interface';

	export let reactiveSearchPromise: SearchPromise;
	export let searchType: SearchType;
	export let handleClick: (bookSearch: BookSearch) => void;
</script>

{#if searchType !== 'none'}
	{#await reactiveSearchPromise()}
		<div data-testid="searchLoader" class="flex flex-1 justify-center items-center">
			<span
				class="animate-spin w-14 h-14 border-4 border-lime-600 rounded-full border-t-transparent"
			/>
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
