<script lang="ts">
	import ContentsGrid from '$lib/client/UI/Contents/ContentsGrid/ContentsGrid.svelte';
	import ContentFilters from '$lib/client/Shared/Components/Headers/ContentFilters.svelte';
	import ContentHeader from '$lib/client/Shared/Components/Headers/ContentHeader.svelte';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
	import type {
		deletionBookInfoParameter,
		updateBookInfoParameter
	} from '$lib/client/Helpers/Svelte/CustomEvent/Dispatcher';
	import {
		handleBookInfosDeletion,
		handleBookInfosUpdate,
		handleFailure
	} from '$lib/client/Helpers/Svelte/CustomEvent/Handler';
	import { mainToastTarget } from '$lib/client/Helpers/Toast';
	import { emptyMessages } from '$lib/client/Static/DisplayValues';
	import ContentModal from '$lib/client/UI/Contents/ContentModal/ContentModal.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import _ from 'lodash';
	import { onMount, type ComponentType } from 'svelte';

	/**ヘッダー用アイコン */
	export let headerIcon: ComponentType;
	/**ヘッダー用テキスト */
	export let headerText: string;
	/**書誌データの一覧 */
	export let items: BookInfoResponseItem[] | undefined;
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
	let currentItem: BookInfoResponseItem;

	// $: {
	// 	bookInfos = toggleFavorite(bookInfos, toggleFilterItems[0]);
	// }

	const displayModal = (item: BookInfoResponseItem) => {
		currentItem = _.cloneDeep(item);
		isDisplayModal = true;
	};

	const handleUpdateSuccess = (event: CustomEvent<updateBookInfoParameter>) => {
		items = handleBookInfosUpdate(items, event.detail, isBooksRoute);
	};
	const handleDeletionSuccess = (event: CustomEvent<deletionBookInfoParameter>) => {
		items = handleBookInfosDeletion(items, event.detail);
	};

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
	<ContentsGrid {items} {emptyMessage} on:click={(event) => displayModal(event.detail)} />
	{#if isDisplayModal}
		<ContentModal
			item={currentItem}
			bind:isDisplay={isDisplayModal}
			on:updateSuccess={handleUpdateSuccess}
			on:deleteSuccess={handleDeletionSuccess}
			on:failed={handleFailure}
		/>
	{/if}
	<div class="wrap-bottom">
		<SvelteToast target={mainToastTarget} />
	</div>
</main>

<style>
	.flexWidth {
		width: calc(100% - (80px));
	}
	.wrap-bottom {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
