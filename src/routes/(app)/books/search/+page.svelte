<script lang="ts">
	import { toastTargetName } from '$lib/client/Helpers/Toast';
	import { pageTitles } from '$lib/client/UI/Shared/DisplayData';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import ContentModal from '$lib/components/search/ContentModal.svelte';
	import SearchModal from '$lib/components/search/SearchModal.svelte';
	import PagingLabel from '$lib/components/search/parts/PagingLabel.svelte';
	import SearchResult from '$lib/components/search/result/SearchResult.svelte';
	import MagnifingGlass from '$lib/icons/MagnifingGlass.svelte';
	import { pushErrorToast, pushSuccessToast } from '$lib/utils/toast';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { books_v1 } from 'googleapis';
	import type { PageData } from './$types';

	export let data: PageData;
	let isDisplaySearchModal = data.props.searchType === 'none';
	let resultCount = 0;
	let isLoading = false;

	let currentBookInfo: books_v1.Schema$Volume;
	let isDisplayDetail = false;

	let runPromise: () => Promise<books_v1.Schema$Volumes>;
	$: {
		//再検索時に再実行されるようreactive化
		runPromise = async (): Promise<books_v1.Schema$Volumes> => {
			isLoading = true;
			const result = await data.requestBookInfo();
			isLoading = false;
			resultCount = result.totalItems!;
			return result;
		};
	}

	const displayDetail = (bookInfo: books_v1.Schema$Volume) => {
		currentBookInfo = bookInfo;
		isDisplayDetail = true;
	};
</script>

<svelte:head>
	<title>{pageTitles.search}</title>
</svelte:head>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
		<ContentHeader headerIcon={MagnifingGlass} headerText={pageTitles.search} />
		<div class="flex justify-between">
			<PrimalyButton
				type="button"
				text="検索条件"
				isUseMargin={false}
				on:click={() => (isDisplaySearchModal = !isDisplaySearchModal)}
			/>
			<PagingLabel {...data.props} {resultCount} {isLoading} />
		</div>
		<SearchModal bind:isDisplay={isDisplaySearchModal} action="" />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
		<SearchResult
			searchType={data.props.searchType}
			{runPromise}
			on:click={(event) => displayDetail(event.detail)}
		/>
		<div class="flex justify-center py-2">
			<PagingLabel {...data.props} {resultCount} {isLoading} isBottom={true} />
		</div>
		{#if isDisplayDetail}
			<ContentModal
				item={currentBookInfo}
				bind:isDisplay={isDisplayDetail}
				on:success={(event) => pushSuccessToast(event.detail.message, toastTargetName)}
				on:failed={(event) => pushErrorToast(event.detail, toastTargetName)}
			/>
		{/if}
		<div class="wrap-bottom">
			<SvelteToast target={toastTargetName} />
		</div>
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
	.wrap-bottom {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
