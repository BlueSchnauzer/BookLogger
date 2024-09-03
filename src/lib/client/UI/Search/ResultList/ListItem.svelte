<script lang="ts">
	import CategoryLabel from '$lib/client/UI/Shared/Components/CategoryLabel.svelte';
	import type { BookSearchResponseItem } from '$lib/client/Application/Interface';

	export let response: BookSearchResponseItem;
	export let handleClick: (response: BookSearchResponseItem) => void;
</script>

<li class="flex">
	<button
		class="p-2 my-2 flex flex-auto bg-gray-100 rounded-lg shadow-md"
		on:click={() => handleClick(response)}
	>
		{#if response.entity.thumbnail}
			<img
				class="flex-shrink-0 self-center w-[128px] h-[182px] shadow-md"
				title={response.view.getTitleLabel()}
				src={response.entity.thumbnail}
				alt="書影"
			/>
		{:else}
			<div
				class="flex-shrink-0 self-center flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
				title={response.view.getTitleLabel()}
			>
				<span>No Image</span>
			</div>
		{/if}
		<div class="p-2 flex flex-col items-start text-left">
			{#if response.entity.title}
				<span class="text-lg font-bold text-lime-700">{response.entity.title}</span>
			{:else}
				<span class="text-lg font-bold text-gray-400">データ無し</span>
			{/if}
			<div class="p-2 flex flex-col items-start">
				<CategoryLabel categoryText="著者" displayText={response.view.joinUpToFiveAuthorNames()} />
				<CategoryLabel categoryText="発売日" displayText={response.entity.publishedDate} />
				<div class="p-2">
					<p class="collapseDescription">{response.entity.description ?? ''}</p>
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
