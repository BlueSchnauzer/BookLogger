<script lang="ts">
	import BookInfoGrid from '$lib/components/content/BookInfoGrid.svelte';
	import RegisteredModal from '$lib/components/content/RegisteredModal.svelte';
	import ContentFilters from '$lib/components/header/ContentFilters.svelte';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { toggleFavorite } from '$lib/utils/bookInfo';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import SimpleBar from 'simplebar';
	//iOS Safariなど用に追加
	import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import {
		handleBookInfoViewsDeletion,
		handleBookInfoViewsUpdate,
		handleFailure
	} from '$lib/client/Helpers/CustomEvent/Handler';
	import { toastTargetName } from '$lib/client/Helpers/Toast';
	import ResizeObserver from 'resize-observer-polyfill';
	import 'simplebar/dist/simplebar.css';
	import { onMount, type ComponentType } from 'svelte';

	/**ヘッダー用アイコン */
	export let headerIcon: ComponentType;
	/**ヘッダー用テキスト */
	export let headerText: string;
	/**書誌データの一覧 */
	export let views: BookInfoView[];
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
	let isDisplayModal = false;
	let currentView: BookInfoView;
	let gridContent: HTMLElement;

	// $: {
	// 	bookInfos = toggleFavorite(bookInfos, toggleFilterItems[0]);
	// }

	const displayModal = (view: BookInfoView) => {
		//これだと関数がコピーできない。単に再代入だとやっぱダメだよね？
		//currentBookInfo = structuredClone(item);
		currentView = view;
		isDisplayModal = true;
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
		<BookInfoGrid {views} {emptyMessage} on:click={(event) => displayModal(event.detail)} />
	</div>
	{#if isDisplayModal}
		<RegisteredModal
			view={currentView}
			bind:isDisplay={isDisplayModal}
			on:updateSuccess={(event) => handleBookInfoViewsUpdate(views, event.detail, isBooksRoute)}
			on:deleteSuccess={(event) => handleBookInfoViewsDeletion(views, event.detail)}
			on:failed={handleFailure}
		/>
	{/if}
	<div class="wrap-bottom">
		<SvelteToast target={toastTargetName} />
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
