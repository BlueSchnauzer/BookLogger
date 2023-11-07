<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
	import BookCase from '$lib/icons/BookCase.svelte';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import ContentFilters from '$lib/components/header/ContentFilters.svelte';
	import BookInfoGrid from '$lib/components/content/BookInfoGrid.svelte';
	import DetailModal from '$lib/components/common/DetailModal.svelte';
	import * as utils from '$lib/utils';
	import { SvelteToast } from '@zerodevx/svelte-toast';
  import SimpleBar from 'simplebar';
  import 'simplebar/dist/simplebar.css';
  //iOS Safariなど用に追加
  import ResizeObserver from 'resize-observer-polyfill';
	import { onMount } from 'svelte';

  export let bookInfos: BookInfo[];
	export let toggleFilterItems: toggleFilterItem[];
  export let selectFilterItems: selectFilterItem[];

  /**インプットの値*/
	let inputValue: string;
	/**リストの値*/
	let selectValue: number;
	let isDisplayDetail = false;
	let currentBookInfo: BookInfo;

  $: { bookInfos = utils.toggleFavorite(bookInfos, toggleFilterItems[0]); }

	const displayModal = (item: BookInfo) => {
		currentBookInfo = structuredClone(item);
		isDisplayDetail = true;
	}

  onMount(() => {
    //SSR時のエラー回避のためDOM生成後に実行
    window.ResizeObserver = ResizeObserver;
    const mainContent = window.document.querySelector<HTMLElement>('#mainContent');
    if (mainContent) { new SimpleBar(mainContent, {autoHide: false}); }
  });

</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
		<ContentHeader headerIcon={BookCase} headerText="登録した本" isDisplayAddButton={true} />
		<ContentFilters bind:toggleFilterItems bind:inputValue {selectFilterItems} bind:selectValue />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div id="mainContent" class="p-1 contentHeight">
		<BookInfoGrid bookInfos={bookInfos} on:click={(event) => displayModal(event.detail)} />
	</div>
	{#if isDisplayDetail}
		<DetailModal
			bookInfo={currentBookInfo}
			bind:isDisplay={isDisplayDetail}
			on:success={(event) => (bookInfos = utils.handleSuccess(bookInfos, event.detail))}
			on:failed={(event) => utils.pushErrorToast(event.detail)}
		/>
	{/if}
	<SvelteToast />
</main>

<style>
	.flexWidth {
		width: calc(100% - (224px));
	}
	.contentHeight {
		height: calc(100% - 96px);
	}
</style>
