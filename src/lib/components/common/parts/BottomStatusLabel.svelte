<script lang="ts">
	import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import { colorStone700 } from '$lib/client/UI/Shared/StaticValues';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Icon from '@iconify/svelte';

	export let pathName: string;
	export let view: BookInfoView;
	/**画面サイズが小さくなった際にテキストを非表示にするか*/
	export let isResponsiveText = true;

	const bottomLabelType = view.getTypeForBottomLabel(pathName);
</script>

{#if bottomLabelType === 'createDate'}
	<div class="self-center flex justify-between {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="pl-2 flex items-center">
			<PileOfBooks height={18} width={18} color={colorStone700} />
			<span class="pl-1 text-xs">登録日</span>
		</div>
		<span class="pr-2 text-sm">{view.getDateLabel('create')}</span>
	</div>
{:else if bottomLabelType === 'progress' && !view.isDisplayableProgress}
	<div class="self-center flex justify-between {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="pl-2 flex items-center">
			<Icon icon="mdi:pencil-plus-outline" width="18" height="18" color={colorStone700} />
			<span class="pl-1 text-xs">更新日</span>
		</div>
		<span class="pr-2 text-sm">{view.getDateLabel('update')}</span>
	</div>
{:else if bottomLabelType === 'progress'}
	<div class="self-center flex flex-col {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="px-2 pb-1.5 text-xs flex justify-between">
			<span>読んだページ数</span>
			<span>{view.maxPageCountFromHistory}ページ</span>
		</div>
		<div class="self-center w-[90%] h-2 bg-gray-300 rounded-full">
			<div
				class="h-2 rounded-full bg-lime-600"
				style="width: {view.progressByPercent};"
				data-testid="pageProgress"
			></div>
		</div>
	</div>
{:else if bottomLabelType === 'completeDate'}
	<div class="self-center flex justify-between {isResponsiveText ? 'max-sm:hidden' : ''}">
		<div class="pl-2 flex items-center">
			<CompleteBook width={18} height={18} color={colorStone700} />
			<span class="pl-1 text-xs">読み終わった日</span>
		</div>
		<span class="pr-2 text-sm">{view.getDateLabel('complete')}</span>
	</div>
{/if}
