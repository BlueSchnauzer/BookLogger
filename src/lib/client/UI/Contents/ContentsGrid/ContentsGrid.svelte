<script lang="ts">
	import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
	import GridItem from '$lib/client/UI/Contents/ContentsGrid/GridItem.svelte';
	import ResizeObserver from 'resize-observer-polyfill';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import { onMount } from 'svelte';

	export let bookInfos: BookInfo[] | undefined;
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;
	export let handleClick: (bookInfo: BookInfo) => void;

	let contentGrid: HTMLElement;

	onMount(() => {
		window.ResizeObserver = ResizeObserver;
		if (contentGrid) {
			new SimpleBar(contentGrid, { autoHide: false });
		}
	});
</script>

{#if bookInfos && bookInfos.length}
	<div bind:this={contentGrid} class="p-1 contentHeight">
		<ul
			class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
		>
			{#each bookInfos as bookInfo (bookInfo.id)}
				<li style="display: inherit;" title={bookInfo.title}>
					<button
						class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
						on:click={() => handleClick(bookInfo)}
					>
						<GridItem {bookInfo} />
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
