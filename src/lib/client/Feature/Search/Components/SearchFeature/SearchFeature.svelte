<script lang="ts">
	import MagnifingGlass from '$lib/client/Shared/Icons/MagnifingGlass.svelte';
	import { pushToastOnFailed, pushToastOnSuccess } from '$lib/client/Shared/Helpers/Toast';
	import type { SearchPromise } from '$lib/client/Feature/Search/interface';
	import type { SearchProps } from '$lib/client/Feature/Search/Components/SearchFeature/Interface';
	import { pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	import PagingLabel from '$lib/client/Feature/Search/Components/SearchFeature//PagingLabel.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import ResultList from '$lib/client/Feature/Search/Components/ResultList/ResultList.svelte';
	import ContentHeader from '$lib/client/Shared/Components/Headers/ContentHeader.svelte';
	import ConditionModal from '$lib/client/Feature/Search/Components/ConditionModal/ConditionModal.svelte';
	import ItemModal from '$lib/client/Feature/Search/Components/ItemModal/ItemModal.svelte';
	import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
	import MainToast from '$lib/client/Shared/Components/Toast/MainToast.svelte';

	export let searchPromise: SearchPromise;
	export let searchProps: SearchProps;

	let isDisplayConditionModal = searchProps.searchType === 'none';
	let resultCount = 0;
	let isLoading = false;

	let currentItem: BookSearch;
	let isDisplayItem = false;

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

	const handleClick = (bookSearch: BookSearch) => {
		currentItem = bookSearch;
		isDisplayItem = true;
	};
</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
		<ContentHeader headerIcon={MagnifingGlass} headerText={pageTitles.search} />
		<div class="flex justify-between">
			<PrimaryButton
				type="button"
				text="検索条件"
				isUseMargin={false}
				on:click={() => (isDisplayConditionModal = !isDisplayConditionModal)}
			/>
			<PagingLabel {searchProps} {resultCount} {isLoading} />
		</div>
		<ConditionModal bind:isDisplay={isDisplayConditionModal} />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
		<ResultList searchType={searchProps.searchType} {reactiveSearchPromise} {handleClick} />
		<div class="flex justify-center py-2">
			<PagingLabel {searchProps} {resultCount} {isLoading} isBottom={true} />
		</div>
		{#if isDisplayItem}
			<ItemModal
				bookSearch={currentItem}
				bind:isDisplay={isDisplayItem}
				onSuccess={pushToastOnSuccess}
				onFailed={pushToastOnFailed}
			/>
		{/if}
		<MainToast />
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
