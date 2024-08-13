<script lang="ts">
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
	import {
		dispatchBookInfoClick,
		type bookInfoClickEvent
	} from '$lib/client/Helpers/CustomEvent/Dispatcher';
	import GridContent from '$lib/components/content/parts/GridContent.svelte';
	import { createEventDispatcher } from 'svelte';

	export let items: BookInfoResponseItem[] | undefined;
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;

	const dispatch = createEventDispatcher<bookInfoClickEvent>();
	const handleClick = (item: BookInfoResponseItem) => {
		dispatchBookInfoClick(dispatch, item);
	};
</script>

{#if items && items.length}
	<ul
		class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
	>
		{#each items as data (data.entity.id)}
			<li style="display: inherit;" title={data.entity.title}>
				<button
					class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
					on:click={() => handleClick(data)}
				>
					<GridContent item={data} />
				</button>
			</li>
		{/each}
	</ul>
{:else}
	<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
{/if}
