<script lang="ts">
	import type { searchPromise } from '$lib/client/Application/Interface';
	import type { BookSearchView } from '$lib/client/Application/Views/BookSearch';
	import {
		dispatchBookSearchViewClick,
		type bookSearchEvent
	} from '$lib/client/Helpers/CustomEvent/Dispatcher';
	import type { SearchType } from '$lib/client/Utils/types';
	import InfoLabel from '$lib/components/common/parts/CategoryLabel.svelte';
	import type { books_v1 } from 'googleapis';
	import { createEventDispatcher } from 'svelte';

	export let reactiveSearchPromise: searchPromise<books_v1.Schema$Volume>;
	export let searchType: SearchType;

	const dispatch = createEventDispatcher<bookSearchEvent>();
	const handleViewClick = (view: BookSearchView<books_v1.Schema$Volume>) => {
		dispatchBookSearchViewClick(dispatch, view);
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
	{:then result}
		{#if result.views}
			<ul data-testid="resultList">
				{#each result.views as view (view.id)}
					<li class="flex">
						<button
							class="p-2 my-2 flex flex-auto bg-gray-100 rounded-lg shadow-md"
							on:click={() => handleViewClick(view)}
						>
							{#if view.thumbnail}
								<img
									class="flex-shrink-0 self-center w-[128px] h-[182px] shadow-md"
									title={view.titleLabel}
									src={view.thumbnail}
									alt="書影"
								/>
							{:else}
								<div
									class="flex-shrink-0 self-center flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
									title={view.titleLabel}
								>
									<span>No Image</span>
								</div>
							{/if}
							<div class="p-2 flex flex-col items-start text-left">
								{#if view.title}
									<span class="text-lg font-bold text-lime-700">{view.title}</span>
								{:else}
									<span class="text-lg font-bold text-gray-400">データ無し</span>
								{/if}
								<div class="p-2 flex flex-col items-start">
									<InfoLabel
										categoryText="著者"
										condition={view.authors}
										labelFunction={() => view.joinUpToFiveAuthorNames}
									/>
									<InfoLabel
										categoryText="発売日"
										condition={view.publishedDate}
										labelFunction={() => view.publishedDate}
									/>
									<div class="p-2">
										<p class="collapseDescription">{view.description ?? ''}</p>
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
