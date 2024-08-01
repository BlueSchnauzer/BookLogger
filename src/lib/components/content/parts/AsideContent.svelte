<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import Icon from '@iconify/svelte';

	export let bookInfo: BookInfo;

	const getLabel = (data?: string | number): string => {
		return data?.toString() ?? 'データ無し';
	};
</script>

<div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
	{#if bookInfo.thumbnail}
		<img
			class="mb-2 self-center w-[128px] h-[182px] shadow-md"
			title={getLabel(bookInfo.title)}
			src={bookInfo.thumbnail}
			alt="書影"
		/>
		<span class="self-center text-gray-400 text-xs">Image By Google</span>
	{:else}
		<div
			class="mb-2 flex justify-center items-center self-center w-[128px] h-[182px] shadow-md bg-slate-300"
			title={getLabel(bookInfo.title)}
		>
			<span>No Image</span>
		</div>
	{/if}
	<div class="flex items-center max-sm:absolute max-sm:right-4">
		<button
			id="btnFavorite"
			class="flex items-center"
			on:click={() => (bookInfo.isFavorite = !bookInfo.isFavorite)}
			data-testid="btnFavorite"
		>
			{#if bookInfo.isFavorite}
				<Icon icon="ph:star-fill" color="#65a30d" width="32" height="32" />
			{:else}
				<Icon icon="ph:star-light" color="#65a30d" width="32" height="32" />
			{/if}
		</button>
		<label for="btnFavorite" class="ml-1 text-lg max-sm:hidden">お気に入り</label>
	</div>
</div>
