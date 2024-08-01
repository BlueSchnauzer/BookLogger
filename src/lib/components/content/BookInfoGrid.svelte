<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { createEventDispatcher } from 'svelte';
	import GridContent from '$lib/components/content/parts/GridContent.svelte';

	export let bookInfos: BookInfo[];
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;

	const isExistDisplayableItems = (bookInfos: BookInfo[]): boolean => {
		if (!bookInfos || bookInfos.length === 0) {
			return false;
		}

		const visibleCount = bookInfos.filter((item) => item.isVisible).length;
		if (visibleCount === 0) {
			return false;
		}

		return true;
	};

	const dispatch = createEventDispatcher();
	const handleClick = (item: BookInfo) => {
		dispatch('click', item);
	};
</script>

{#if isExistDisplayableItems(bookInfos)}
	<ul
		class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
	>
		{#each bookInfos as bookInfo (bookInfo._id)}
			{#if bookInfo.isVisible}
				<li style="display: inherit;" title={bookInfo.title}>
					<button
						class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
						on:click={() => handleClick(bookInfo)}
					>
						<GridContent {bookInfo} />
					</button>
				</li>
			{/if}
		{/each}
	</ul>
{:else}
	<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
{/if}
