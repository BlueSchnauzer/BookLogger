<script lang="ts">
	import type { BookSearchResponseItem, SearchPromise } from '$lib/client/Application/Interface';
	import { handleFailure, handleSuccess } from '$lib/client/Helpers/Svelte/CustomEvent/Handler';
	import { mainToastTarget } from '$lib/client/Helpers/Toast';
	import { pageTitles } from '$lib/client/Static/DisplayValues';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import ContentModal from '$lib/components/search/ContentModal.svelte';
	import SearchModal from '$lib/components/search/SearchModal.svelte';
	import PagingLabel from '$lib/components/search/parts/PagingLabel.svelte';
	import SearchResult from '$lib/components/search/result/SearchResult.svelte';
	import MagnifingGlass from '$lib/icons/MagnifingGlass.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { PageData } from './$types';

	export let data: PageData;
	let isDisplaySearchModal = data.searchProps.searchType === 'none';
	let resultCount = 0;
	let isLoading = false;

	let currentItem: BookSearchResponseItem;
	let isDisplayDetail = false;

	let reactiveSearchPromise: SearchPromise;
	$: {
		//再検索時に再実行されるようreactive化
		reactiveSearchPromise = async () => {
			isLoading = true;
			const result = await data.searchPromise();
			isLoading = false;
			resultCount = result.totalCount;
			return result;
		};
	}

	const handleClick = (event: CustomEvent<BookSearchResponseItem>) => {
		currentItem = event.detail;
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
			<PagingLabel {...data.searchProps} {resultCount} {isLoading} />
		</div>
		<SearchModal bind:isDisplay={isDisplaySearchModal} action="" />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
		<SearchResult
			searchType={data.searchProps.searchType}
			{reactiveSearchPromise}
			on:click={handleClick}
		/>
		<div class="flex justify-center py-2">
			<PagingLabel {...data.searchProps} {resultCount} {isLoading} isBottom={true} />
		</div>
		{#if isDisplayDetail}
			<ContentModal
				bookSearch={currentItem}
				bind:isDisplay={isDisplayDetail}
				on:success={handleSuccess}
				on:failed={handleFailure}
			/>
		{/if}
		<div class="wrap-bottom">
			<SvelteToast target={mainToastTarget} />
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
