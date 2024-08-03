<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import GridContent from '$lib/components/content/parts/GridContent.svelte';
	import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import {
		dispatchBookInfoViewClick,
		type bookInfoClickEvent
	} from '$lib/client/Helpers/CustomEvent/Dispatcher';

	export let views: BookInfoView[];
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;

	//これいらない。
	// const isExistDisplayableItems = (bookInfos: BookInfo[]): boolean => {
	// 	if (!bookInfos || bookInfos.length === 0) {
	// 		return false;
	// 	}

	// 	const visibleCount = bookInfos.filter((item) => item.isVisible).length;
	// 	if (visibleCount === 0) {
	// 		return false;
	// 	}

	// 	return true;
	// };

	// const dispatch = createEventDispatcher();
	// const handleClick = (item: BookInfo) => {
	// 	dispatch('click', item);
	// };

	const dispatch = createEventDispatcher<bookInfoClickEvent>();
	const handleClick = (view: BookInfoView) => {
		dispatchBookInfoViewClick(dispatch, view);
	};
</script>

{#if views && views.length}
	<ul
		class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
	>
		{#each views as view (view.id)}
			<li style="display: inherit;" title={view.title}>
				<button
					class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
					on:click={() => handleClick(view)}
				>
					<GridContent {view} />
				</button>
			</li>
		{/each}
	</ul>
{:else}
	<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
{/if}
