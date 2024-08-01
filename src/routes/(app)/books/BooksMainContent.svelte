<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import ContentFilters from '$lib/components/header/ContentFilters.svelte';
	import BookInfoGrid from '$lib/components/content/BookInfoGrid.svelte';
	import RegisteredModal from '$lib/components/content/RegisteredModal.svelte';
	import { handleSuccess, toggleFavorite } from '$lib/utils/bookInfo';
	import { pushErrorToast } from '$lib/utils/toast';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	//iOS Safariなど用に追加
	import ResizeObserver from 'resize-observer-polyfill';
	import { onMount, type ComponentType } from 'svelte';

	/**ヘッダー用アイコン */
	export let headerIcon: ComponentType;
	/**ヘッダー用テキスト */
	export let headerText: string;
	/**書誌データの一覧 */
	export let bookInfos: BookInfo[];
	/**ライブラリ画面(/booksルート)用にレンダリングするか */
	export let isBooksRoute = false;
	/**絞り込み用のラベルフィルター */
	export let toggleFilterItems: toggleFilterItem[];
	/**絞り込み用のドロップダウンフィルター */
	export let selectFilterItems: selectFilterItem[];
	/**データ0件の時に表示するメッセージ */
	export let emptyMessage = '本が登録されていません。<br>検索メニューから書籍を登録してください！';

	let inputValue: string;
	let selectValue: number;
	let isDisplayDetail = false;
	let currentBookInfo: BookInfo;
	let gridContent: HTMLElement;
	const target = 'mainToast';

	$: {
		bookInfos = toggleFavorite(bookInfos, toggleFilterItems[0]);
	}

	const displayModal = (item: BookInfo) => {
		currentBookInfo = structuredClone(item);
		isDisplayDetail = true;
	};

	onMount(() => {
		//SSR時のエラー回避のためDOM生成後に実行
		window.ResizeObserver = ResizeObserver;
		if (gridContent) {
			new SimpleBar(gridContent, { autoHide: false });
		}

		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
		<ContentHeader {headerIcon} {headerText} />
		<ContentFilters />
	</div>
	<div class="mx-2 mb-1 bg-stone-400 h-[1px] xl:block" />
	<div bind:this={gridContent} class="p-1 contentHeight">
		<BookInfoGrid {bookInfos} {emptyMessage} on:click={(event) => displayModal(event.detail)} />
	</div>
	{#if isDisplayDetail}
		<RegisteredModal
			bookInfo={currentBookInfo}
			bind:isDisplay={isDisplayDetail}
			on:success={(event) =>
				(bookInfos = handleSuccess(bookInfos, event.detail, target, isBooksRoute))}
			on:failed={(event) => pushErrorToast(event.detail, target)}
		/>
	{/if}
	<div class="wrap-bottom">
		<SvelteToast {target} />
	</div>
</main>

<style>
	.flexWidth {
		width: calc(100% - (80px));
	}
	.contentHeight {
		height: calc(100% - 96px);
	}
	.wrap-bottom {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
