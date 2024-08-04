<script lang="ts">
	import type { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import Icon from '@iconify/svelte';

	export let view: BookInfoView;
</script>

<div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
	{#if view.thumbnail}
		<img
			class="mb-2 self-center w-[128px] h-[182px] shadow-md"
			title={view.titleLabel}
			src={view.thumbnail}
			alt="書影"
		/>
		<span class="self-center text-gray-400 text-xs">Image By Google</span>
	{:else}
		<div
			class="mb-2 flex justify-center items-center self-center w-[128px] h-[182px] shadow-md bg-slate-300"
			title={view.titleLabel}
		>
			<span>No Image</span>
		</div>
	{/if}
	<div class="flex items-center max-sm:absolute max-sm:right-4">
		<button
			id="btnFavorite"
			class="flex items-center"
			on:click={() => (view.isFavorite = !view.isFavorite)}
			data-testid="btnFavorite"
		>
			{#if view.isFavorite}
				<Icon icon="ph:star-fill" color="#65a30d" width="32" height="32" />
			{:else}
				<Icon icon="ph:star-light" color="#65a30d" width="32" height="32" />
			{/if}
		</button>
		<label for="btnFavorite" class="ml-1 text-lg max-sm:hidden">お気に入り</label>
	</div>
</div>
