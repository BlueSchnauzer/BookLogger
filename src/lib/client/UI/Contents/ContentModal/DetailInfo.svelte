<script lang="ts">
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
	import Icon from '@iconify/svelte';

	export let item: BookInfoResponseItem;
</script>

<div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
	{#if item.entity.thumbnail}
		<img
			class="mb-2 self-center w-[128px] h-[182px] shadow-md"
			title={item.view.getTitleLabel()}
			src={item.entity.thumbnail}
			alt="書影"
		/>
		<span class="self-center text-gray-400 text-xs">Image By Google</span>
	{:else}
		<div
			class="mb-2 flex justify-center items-center self-center w-[128px] h-[182px] shadow-md bg-slate-300"
			title={item.view.getTitleLabel()}
		>
			<span>No Image</span>
		</div>
	{/if}
	<div class="flex items-center max-sm:absolute max-sm:right-4">
		<button
			id="btnFavorite"
			class="flex items-center"
			on:click={() => (item.entity.isFavorite = !item.entity.isFavorite)}
			data-testid="btnFavorite"
		>
			{#if item.entity.isFavorite}
				<Icon icon="ph:star-fill" color="#65a30d" width="32" height="32" />
			{:else}
				<Icon icon="ph:star-light" color="#65a30d" width="32" height="32" />
			{/if}
		</button>
		<label for="btnFavorite" class="ml-1 text-lg max-sm:hidden">お気に入り</label>
	</div>
</div>
