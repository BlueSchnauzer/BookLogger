<script lang="ts">
	import type { PageData } from './$types';
	import type { books_v1 } from 'googleapis';
	import BookAdd from '$lib/icons/BookAdd.svelte';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import SearchModal from '$lib/components/search/SearchModal.svelte';
	import SearchResult from '$lib/components/search/result/SearchResult.svelte';
	import DetailModal from '$lib/components/common/DetailModal.svelte';
	import PagingLabel from '$lib/components/search/parts/PagingLabel.svelte';
	import { pushSuccessToast, pushErrorToast } from '$lib/utils';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	export let data: PageData;
	let isDisplaySearchModal = false;
	let resultCount = 0;
	let startIndex = 0;
	let isLoading = false;

	let currentBookInfo: books_v1.Schema$Volume;
	let isDisplayDetail = false;

	let runPromise = async (): Promise<books_v1.Schema$Volumes> => {
		isLoading = true;
		const result = await data.getBookInfo();
		isLoading = false;
		resultCount = result.totalItems!;
		return result;
	};
	$: {
		//再検索時に再実行されるようreactive化
		runPromise = async (): Promise<books_v1.Schema$Volumes> => {
			isLoading = true;
			//ページングを初期化
			startIndex = 0;
			resultCount = 0;
			const result = await data.getBookInfo();
			resultCount = result.totalItems!;
			isLoading = false;
			return result;
		};
	}

	/**後方にページング*/
	let pagingBackward = () => {};
	$: {
		pagingBackward = () => {
			if (startIndex === 0) {
				return;
			}
			startIndex -= 10;
			runPromise = async (): Promise<books_v1.Schema$Volumes> => {
				isLoading = true;
				const result = await data.getBookInfo(startIndex);
				isLoading = false;
				return result;
			};
		};
	}

	/**前方にページング*/
	let pagingForward = () => {};
	$: {
		pagingForward = () => {
			if (startIndex + 10 >= resultCount) {
				return;
			}
			startIndex += 10;
			runPromise = async (): Promise<books_v1.Schema$Volumes> => {
				isLoading = true;
				const result = await data.getBookInfo(startIndex);
				isLoading = false;
				return result;
			};
		};
	}

	const displayDetail = (bookInfo: books_v1.Schema$Volume) => {
		currentBookInfo = bookInfo;
		isDisplayDetail = true;
	};
</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
		<ContentHeader headerIcon={BookAdd} headerText="書籍検索" isDisplayAddButton={false} />
		<div class="flex justify-between">
			<PrimalyButton type="button" text="再検索"
				isUseMargin={false}	on:click={() => (isDisplaySearchModal = !isDisplaySearchModal)}
			/>
			<PagingLabel {startIndex}	{resultCount}	{isLoading}	
        on:backward={pagingBackward} on:forward={pagingForward}
			/>
		</div>
		<SearchModal bind:isDisplay={isDisplaySearchModal} action="" />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
		<SearchResult {runPromise} on:click={(event) => displayDetail(event.detail)} />
		<div class="flex justify-center py-2">
			<PagingLabel {startIndex}	{resultCount}	{isLoading}	
        isBottom={true} on:backward={pagingBackward} on:forward={pagingForward}
			/>
		</div>
		{#if isDisplayDetail}
			<DetailModal
				item={currentBookInfo}
				bind:isDisplay={isDisplayDetail}
				on:success={(event) => pushSuccessToast(event.detail.message)}
				on:failed={(event) => pushErrorToast(event.detail)}
			/>
		{/if}
		<SvelteToast />
	</div>
</main>

<style>
	.flexWidth {
		width: calc(100% - (224px));
	}
	.contentHeight {
		height: calc(100% - 96px);
	}
	.customScroll::-webkit-scrollbar {
		width: 8px;
	}
	.customScroll::-webkit-scrollbar-thumb {
		background-color: gray;
		border-radius: 20px;
	}
</style>
