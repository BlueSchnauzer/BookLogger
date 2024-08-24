<script lang="ts">
	import MagnifingGlass from '$lib/client/UI/Shared/Icons/MagnifingGlass.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { mainToastTarget } from '$lib/client/Helpers/Toast';
	import type { BookSearchResponseItem, SearchPromise } from '$lib/client/Application/Interface';
	import type { SearchProps } from '$lib/client/UI/Search/SearchFeature/Interface';
	import { pageTitles } from '$lib/client/Static/DisplayValues';
	import PagingLabel from '$lib/client/UI/Search/SearchFeature//PagingLabel.svelte';
	import PrimalyButton from '$lib/client/UI/Shared/Components/PrimalyButton.svelte';
	import ResultList from '$lib/client/UI/Search/ResultList/ResultList.svelte';
	import ContentHeader from '$lib/client/UI/Shared/Components/Headers/ContentHeader.svelte';
	import SearchModal from '$lib/client/UI/Search/ConditionModal/SearchModal.svelte';

	export let searchPromise: SearchPromise;
	export let searchProps: SearchProps;

	let isDisplaySearchModal = searchProps.searchType === 'none';
	let resultCount = 0;
	let isLoading = false;

	let currentItem: BookSearchResponseItem;
	let isDisplayDetail = false;

	let reactiveSearchPromise: SearchPromise;
	$: {
		//再検索時に再実行されるようreactive化
		reactiveSearchPromise = async () => {
			isLoading = true;
			const result = await searchPromise();
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
			<PagingLabel {searchProps} {resultCount} {isLoading} />
		</div>
		<SearchModal bind:isDisplay={isDisplaySearchModal} />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
		<ResultList
			searchType={searchProps.searchType}
			{reactiveSearchPromise}
			on:click={handleClick}
		/>
		<div class="flex justify-center py-2">
			<PagingLabel {searchProps} {resultCount} {isLoading} isBottom={true} />
		</div>
		<!-- {#if isDisplayDetail}
			<ContentModal
				bookSearch={currentItem}
				bind:isDisplay={isDisplayDetail}
				on:success={handleSuccess}
				on:failed={handleFailure}
			/>
		{/if} -->
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
