<script lang="ts">
	import ContentsGrid from '$lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte';
	import ContentFilters from '$lib/client/Shared/Components/Headers/ContentFilters.svelte';
	import ContentHeader from '$lib/client/Shared/Components/Headers/ContentHeader.svelte';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import { emptyMessages } from '$lib/client/Shared/Constants/DisplayValues';
	import ContentModal from '$lib/client/Feature/Contents/Components/ContentModal/ContentModal.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import _ from 'lodash';
	import { onMount, type ComponentType } from 'svelte';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import MainToast from '$lib/client/Shared/Components/Toast/MainToast.svelte';

	/**ヘッダー用アイコン */
	export let headerIcon: ComponentType;
	/**ヘッダー用テキスト */
	export let headerText: string;
	/**書誌データの一覧 */
	export let bookInfos: BookInfo[] | undefined;
	/**ライブラリ画面(/booksルート)用にレンダリングするか */
	export let isBooksRoute = false;
	/**絞り込み用のラベルフィルター */
	//export let toggleFilterItems: toggleFilterItem[];
	/**絞り込み用のドロップダウンフィルター */
	//export let selectFilterItems: selectFilterItem[];
	/**データ0件の時に表示するメッセージ */
	export let emptyMessage = emptyMessages.default;

	let inputValue: string;
	let selectValue: number;
	let isDisplayModal = false;
	let currentItem: BookInfo;

	// $: {
	// 	bookInfos = toggleFavorite(bookInfos, toggleFilterItems[0]);
	// }

	const handleClick = (bookInfo: BookInfo) => {
		currentItem = bookInfo;
		isDisplayModal = true;
	};
	// const displayModal = (item: BookInfoResponseItem) => {
	// 	currentItem = _.cloneDeep(item);
	// 	isDisplayModal = true;
	// };

	// const handleUpdateSuccess = (bookInfo: BookInfo) => {
	// 	bookInfos = handleBookInfosUpdate(items, event.detail, isBooksRoute);
	// };
	// const handleDeletionSuccess = (event: CustomEvent<deletionBookInfoParameter>) => {
	// 	items = handleBookInfosDeletion(items, event.detail);
	// // };

	onMount(() => {
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
	<ContentsGrid {bookInfos} {emptyMessage} {handleClick} />
	{#if isDisplayModal}
		<ContentModal bookInfo={currentItem} bind:isDisplay={isDisplayModal} />
	{/if}
	<MainToast />
</main>

<style>
	.flexWidth {
		width: calc(100% - (80px));
	}
</style>
