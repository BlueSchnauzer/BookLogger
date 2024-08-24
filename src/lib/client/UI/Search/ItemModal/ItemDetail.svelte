<script lang="ts">
	import type { BookSearchResponseItem } from '$lib/client/Application/Interface';
	import CategoryLabel from '$lib/client/UI/Shared/Components/CategoryLabel.svelte';

	export let bookSearch: BookSearchResponseItem;
</script>

<div class="flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
	<div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
		{#if bookSearch.entity.thumbnail}
			<img
				class="self-center w-[128px] h-[182px] shadow-md"
				title={bookSearch.view.getTitleLabel()}
				src={bookSearch.entity.thumbnail}
				alt="書影"
			/>
			<span class="self-center text-gray-400 text-xs">Image By Google</span>
		{:else}
			<div
				class="flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
				title={bookSearch.view.getTitleLabel()}
			>
				<span>No Image</span>
			</div>
		{/if}
	</div>
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
	<div
		class="flex flex-col flex-grow p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll"
	>
		{#if bookSearch.entity.title}
			<span data-testid="searchedItemTitle" class="pt-2 text-lg font-bold text-lime-700"
				>{bookSearch.entity.title}</span
			>
		{:else}
			<span class="pt-2 text-lg font-bold text-gray-400">データ無し</span>
		{/if}
		<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
			<CategoryLabel categoryText="著者" displayText={bookSearch.view.joinAuthorNames()} />
			<CategoryLabel categoryText="出版社" displayText={bookSearch.entity.publisher} />
			<CategoryLabel categoryText="発売日" displayText={bookSearch.entity.publishedDate} />
			<CategoryLabel categoryText="ページ数" displayText={bookSearch.view.getPageCountLabel()} />
		</div>
		<span class="text-lg font-bold">紹介</span>
		<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
			{#if bookSearch.entity.description}
				<p>{bookSearch.entity.description}</p>
			{:else}
				<p class="text-gray-400">データ無し</p>
			{/if}
		</div>
	</div>
</div>

<style>
	@media not all and (min-width: 640px) {
		.max-sm\:overflow-unset {
			overflow: unset;
		}
	}
	.customScroll::-webkit-scrollbar {
		width: 8px;
	}
	.customScroll::-webkit-scrollbar-thumb {
		background-color: gray;
		border-radius: 20px;
	}
</style>
