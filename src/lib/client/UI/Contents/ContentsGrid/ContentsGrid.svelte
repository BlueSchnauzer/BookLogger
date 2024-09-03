<script lang="ts">
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
	import {
		dispatchBookInfoClick,
		type bookInfoClickEvent
	} from '$lib/client/Helpers/Svelte/CustomEvent/Dispatcher';
	import GridItem from '$lib/client/UI/Contents/ContentsGrid/GridItem.svelte';
	import ResizeObserver from 'resize-observer-polyfill';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import { createEventDispatcher, onMount } from 'svelte';

	export let items: BookInfoResponseItem[] | undefined;
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;

	let contentGrid: HTMLElement;

	const dispatch = createEventDispatcher<bookInfoClickEvent>();
	const handleClick = (item: BookInfoResponseItem) => {
		dispatchBookInfoClick(dispatch, item);
	};

	onMount(() => {
		window.ResizeObserver = ResizeObserver;
		if (contentGrid) {
			new SimpleBar(contentGrid, { autoHide: false });
		}
	});
</script>

{#if items && items.length}
	<div bind:this={contentGrid} class="p-1 contentHeight">
		<ul
			class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
		>
			{#each items as data (data.entity.id)}
				<li style="display: inherit;" title={data.entity.title}>
					<button
						class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
						on:click={() => handleClick(data)}
					>
						<GridItem item={data} />
					</button>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div class="p-1 contentHeight">
		<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
	</div>
{/if}

<style>
	.contentHeight {
		height: calc(100% - 96px);
	}
</style>
