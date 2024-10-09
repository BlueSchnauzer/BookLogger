<script lang="ts">
	import ContentsGrid from '$lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte';
	import ContentFilters from '$lib/client/Shared/Components/Headers/ContentFilters.svelte';
	import ContentHeader from '$lib/client/Shared/Components/Headers/ContentHeader.svelte';
	import { goto } from '$app/navigation';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import MainToast from '$lib/client/Shared/Components/Toast/MainToast.svelte';
	import { emptyMessages } from '$lib/client/Shared/Constants/DisplayValues';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount, type ComponentType } from 'svelte';

	/**ヘッダー用アイコン */
	export let headerIcon: ComponentType;
	/**ヘッダー用テキスト */
	export let headerText: string;
	/**書誌データの一覧 */
	export let bookInfos: BookInfo[] | undefined;
	/**ライブラリ画面(/booksルート)用にレンダリングするか */
	//export let isBooksRoute = false;
	/**データ0件の時に表示するメッセージ */
	export let emptyMessage = emptyMessages.default;

	let inputValue: string;
	let selectValue: number;

	const handleClick = (bookId: string | undefined) => goto(`${BooksURLs.books}/${bookId}`);

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
	<MainToast />
</main>

<style>
	.flexWidth {
		width: calc(100% - (80px));
	}
</style>
