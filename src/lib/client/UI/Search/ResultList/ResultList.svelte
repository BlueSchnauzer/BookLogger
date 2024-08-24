<script lang="ts">
	import type { BookSearchResponseItem, SearchPromise } from '$lib/client/Application/Interface';
	import {
		dispatchBookSearchClick,
		type bookSearchClickEvent
	} from '$lib/client/Helpers/Svelte/CustomEvent/Dispatcher';
	import ListItem from '$lib/client/UI/Search/ResultList/ListItem.svelte';
	import type { SearchType } from '$lib/client/UI/Search/SearchFeature/Interface';
	import { createEventDispatcher } from 'svelte';

	export let reactiveSearchPromise: SearchPromise;
	export let searchType: SearchType;

	const dispatch = createEventDispatcher<bookSearchClickEvent>();
	const handleClick = (response: BookSearchResponseItem) => {
		dispatchBookSearchClick(dispatch, response);
	};
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
				{#each response.items as result (result.entity.keyId)}
					<ListItem response={result} {handleClick} />
				{/each}
			</ul>
		{/if}
	{:catch error}
		<p class="px-1 font-medium text-red-500">{error.message}</p>
	{/await}
{:else}
	<p class="px-1 font-medium text-lime-700">検索条件を入力してください。</p>
{/if}
