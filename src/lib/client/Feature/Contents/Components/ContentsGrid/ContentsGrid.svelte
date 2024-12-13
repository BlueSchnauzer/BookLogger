<script lang="ts">
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import GridItem from '$lib/client/Feature/Contents/Components/ContentsGrid/GridItem.svelte';
	import ResizeObserver from 'resize-observer-polyfill';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import { onMount } from 'svelte';
	import PagingLabel from '$lib/client/Feature/Contents/Components/ContentsGrid/PagingLabel.svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';

	export let bookInfos: BookInfo[];
	export let pageCount: number;
	export let lastPageCount: number;
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage: string;

	let contentGrid: HTMLElement;
	const handleClick = (bookId: string | undefined) => goto(`${BooksURLs.books}/${bookId}`);

	onMount(() => {
		window.ResizeObserver = ResizeObserver;
		contentGrid && new SimpleBar(contentGrid, { autoHide: false });
	});

	afterNavigate(() => {
		const gridWrapper = document.querySelector('.simplebar-content-wrapper');
		gridWrapper && (gridWrapper.scrollTop = 0);
	});
</script>

<div bind:this={contentGrid} class="flex flex-grow p-1 relative contentHeight">
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
	<PagingLabel {pageCount} {lastPageCount} />
</div>

<style>
	.contentHeight {
		height: calc(100% - 96px);
	}
</style>
