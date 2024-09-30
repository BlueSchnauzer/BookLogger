<script lang="ts">
	import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
	import {
		getTitleLabel,
		joinUpToFiveAuthorNames
	} from '$lib/client/Feature/Search/DataView/dataView';
	import CategoryLabel from '$lib/client/Shared/Components/CategoryLabel.svelte';

	export let bookSearch: BookSearch;
	export let handleClick: (bookSearch: BookSearch) => void;
</script>

<li class="flex">
	<button
		class="p-2 my-2 flex flex-auto bg-gray-100 rounded-lg shadow-md"
		on:click={() => handleClick(bookSearch)}
	>
		{#if bookSearch.thumbnail}
			<img
				class="flex-shrink-0 self-center w-[128px] h-[182px] shadow-md"
				title={getTitleLabel(bookSearch.title)}
				src={bookSearch.thumbnail}
				alt="書影"
			/>
		{:else}
			<div
				class="flex-shrink-0 self-center flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
				title={getTitleLabel(bookSearch.title)}
			>
				<span>No Image</span>
			</div>
		{/if}
		<div class="p-2 flex flex-col items-start text-left">
			{#if bookSearch.title}
				<span class="text-lg font-bold text-lime-700">{bookSearch.title}</span>
			{:else}
				<span class="text-lg font-bold text-gray-400">データ無し</span>
			{/if}
			<div class="p-2 flex flex-col items-start">
				<CategoryLabel
					categoryText="著者"
					displayText={joinUpToFiveAuthorNames(bookSearch.authors)}
				/>
				<CategoryLabel categoryText="発売日" displayText={bookSearch.publishedDate} />
				<div class="p-2">
					<p class="collapseDescription">{bookSearch.description ?? ''}</p>
				</div>
			</div>
		</div>
	</button>
</li>

<style>
	.collapseDescription {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		line-clamp: 4;
	}
</style>
