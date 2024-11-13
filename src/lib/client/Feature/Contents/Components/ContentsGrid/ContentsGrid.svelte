<script lang="ts">
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import GridItem from '$lib/client/Feature/Contents/Components/ContentsGrid/GridItem.svelte';
	import ResizeObserver from 'resize-observer-polyfill';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { colorLime800 } from '$lib/client/Shared/Constants/DisplayValues';

	export let bookInfos: BookInfo[] | undefined;
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;
	export let handleClick: (bookId: string | undefined) => void;

	let contentGrid: HTMLElement;

	onMount(() => {
		window.ResizeObserver = ResizeObserver;
		if (contentGrid) {
			new SimpleBar(contentGrid, { autoHide: false });
		}
	});
</script>

<div bind:this={contentGrid} class="flex flex-grow p-1 relative contentHeight">
	{#if bookInfos && bookInfos.length}
		<ul
			class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
		>
			{#each bookInfos as bookInfo (bookInfo.id)}
				<li style="display: inherit;" title={bookInfo.title}>
					<button
						class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
						on:click={() => handleClick(bookInfo.id?.value)}
					>
						<GridItem {bookInfo} />
					</button>
				</li>
			{/each}
		</ul>
		<div
			class="flex justify-between items-center sticky bottom-2 m-auto mt-4 py-1 px-4 gap-1 size-fit rounded-full bg-gray-100
    border border-stone-300 shadow"
		>
			<button class="hover:bg-stone-300 rounded">
				<Icon icon="ph:caret-line-left" width="32" height="32" color={colorLime800} />
			</button>
			<button class="hover:bg-stone-300 rounded">
				<Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
			</button>
			<div class="flex px-4">
				<p>1</p>
				<p>/</p>
				<p>10</p>
			</div>
			<button class="hover:bg-stone-300 rounded">
				<Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
			</button>
			<button class="hover:bg-stone-300 rounded">
				<Icon icon="ph:caret-line-right" width="32" height="32" color={colorLime800} />
			</button>
		</div>
	{:else}
		<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
	{/if}
</div>

<style>
	.contentHeight {
		height: calc(100% - 96px);
	}
</style>
