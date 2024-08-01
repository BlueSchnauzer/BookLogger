<script lang="ts">
	import type { typeForBottomLabel } from '$lib/customTypes';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { convertDate } from '$lib/utils/bookInfo';
	import Icon from '@iconify/svelte';

	//書誌データ一覧の下部に、ステータスに応じて表示するラベル。

	export let typeForLabel: typeForBottomLabel;
	export let bookInfo: BookInfo;
	/**画面サイズが小さくなった際にテキストを非表示にするか*/
	export let isResponsiveText = true;

	const colorStone700 = '#44403C';

	const isDisplayableProgress = () => {
		return (
			bookInfo.pageCount &&
			bookInfo.pageCount > 0 &&
			bookInfo.pageHistory &&
			bookInfo.pageHistory?.length > 0
		);
	};

	/**読んだ記録の中から最大のページ数を取得する。*/
	const getMaxPageCount = (): number => {
		return bookInfo.pageHistory?.reduce((max, item) => Math.max(max, item.currentPage), -Infinity)!;
	};

	/**ページ数に対して何ページ読んだかのパーセントを文字列で取得する。*/
	const getProgress = (): string => {
		//小数点を抜いて、パーセントに変換する。
		const ratio = Math.trunc((getMaxPageCount()! / bookInfo.pageCount) * 100);
		return `${ratio.toString()}%`;
	};

	const progress = getProgress();
</script>

{#if typeForLabel === 'createDate'}
	<div class="self-center flex justify-between {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="pl-2 flex items-center">
			<PileOfBooks height={18} width={18} color={colorStone700} />
			<span class="pl-1 text-xs">登録日</span>
		</div>
		<span class="pr-2 text-sm">{convertDate(bookInfo.createDate)}</span>
	</div>
{:else if typeForLabel === 'progress' && !isDisplayableProgress()}
	<div class="self-center flex justify-between {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="pl-2 flex items-center">
			<Icon icon="mdi:pencil-plus-outline" width="18" height="18" color={colorStone700} />
			<span class="pl-1 text-xs">更新日</span>
		</div>
		<span class="pr-2 text-sm">{convertDate(bookInfo.updateDate)}</span>
	</div>
{:else if typeForLabel === 'progress'}
	<div class="self-center flex flex-col {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="px-2 pb-1.5 text-xs flex justify-between">
			<span>読んだページ数</span>
			<span>{getMaxPageCount()}ページ</span>
		</div>
		<div class="self-center w-[90%] h-2 bg-gray-300 rounded-full">
			<div
				class="h-2 rounded-full bg-lime-600"
				style="width: {progress};"
				data-testid="pageProgress"
			></div>
		</div>
	</div>
{:else if typeForLabel === 'completeDate'}
	<div class="self-center flex justify-between {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="pl-2 flex items-center">
			<CompleteBook width={18} height={18} color={colorStone700} />
			<span class="pl-1 text-xs">読み終わった日</span>
		</div>
		<span class="pr-2 text-sm">{convertDate(bookInfo.completeDate)}</span>
	</div>
{/if}
