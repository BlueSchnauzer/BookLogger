<script lang="ts">
	import type { BookSearchResponseItem, SearchPromise } from '$lib/client/Application/Interface';
	import {
		dispatchBookSearchClick,
		type bookSearchClickEvent
	} from '$lib/client/Helpers/Svelte/CustomEvent/Dispatcher';
	import type { SearchType } from '$lib/client/Utils/types';
	import InfoLabel from '$lib/components/common/parts/CategoryLabel.svelte';
	import { createEventDispatcher } from 'svelte';

	export let reactiveSearchPromise: SearchPromise;
	export let searchType: SearchType;

	const dispatch = createEventDispatcher<bookSearchClickEvent>();
	const handleClick = (response: BookSearchResponseItem) => {
		dispatchBookSearchClick(dispatch, response);
	};
</script>

<!-- ネストが深いので分割したい -->
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
					<li class="flex">
						<button
							class="p-2 my-2 flex flex-auto bg-gray-100 rounded-lg shadow-md"
							on:click={() => handleClick(result)}
						>
							{#if result.entity.thumbnail}
								<img
									class="flex-shrink-0 self-center w-[128px] h-[182px] shadow-md"
									title={result.view.getTitleLabel()}
									src={result.entity.thumbnail}
									alt="書影"
								/>
							{:else}
								<div
									class="flex-shrink-0 self-center flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
									title={result.view.getTitleLabel()}
								>
									<span>No Image</span>
								</div>
							{/if}
							<div class="p-2 flex flex-col items-start text-left">
								{#if result.entity.title}
									<span class="text-lg font-bold text-lime-700">{result.entity.title}</span>
								{:else}
									<span class="text-lg font-bold text-gray-400">データ無し</span>
								{/if}
								<div class="p-2 flex flex-col items-start">
									<InfoLabel
										categoryText="著者"
										condition={result.entity.authors}
										labelFunction={() => result.view.joinUpToFiveAuthorNames()}
									/>
									<InfoLabel
										categoryText="発売日"
										condition={result.entity.publishedDate}
										labelFunction={() => result.entity.publishedDate}
									/>
									<div class="p-2">
										<p class="collapseDescription">{result.entity.description ?? ''}</p>
									</div>
								</div>
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	{:catch error}
		<p class="px-1 font-medium text-red-500">{error.message}</p>
	{/await}
{:else}
	<p class="px-1 font-medium text-lime-700">検索条件を入力してください。</p>
{/if}

<style>
	.collapseDescription {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
</style>
