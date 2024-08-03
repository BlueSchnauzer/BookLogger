<script lang="ts">
	import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import { getCurrentDateString } from '$lib/client/Helpers/Date';
	import { toastTargetName } from '$lib/client/Helpers/Toast';
	import { statusItems } from '$lib/client/UI/Shared/DisplayData';
	import { colorStone700 } from '$lib/client/UI/Shared/StaticValues';
	import CategoryLabel from '$lib/components/common/parts/CategoryLabel.svelte';
	import Icon from '@iconify/svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

	export let view: BookInfoView;

	let isEditPageCount = false;
	let readingDate = getCurrentDateString();
	let readingCount: number;
	let isValidDate = true;
	let isValidCount = true;

	onMount(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<div
	class="flex flex-col flex-grow p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll"
>
	{#if view.title}
		<span class="py-2 text-lg font-bold text-lime-700">{view.title}</span>
	{:else}
		<span class="py-2 text-lg font-bold text-gray-400">データ無し</span>
	{/if}
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<CategoryLabel
			categoryText="著者"
			condition={view.author}
			labelFunction={() => view.joinedAuthors}
		/>
		<CategoryLabel
			categoryText="登録日"
			condition={view.createDate}
			labelFunction={() => view.getDateLabel('create')}
		/>
		<CategoryLabel
			categoryText="最終更新日"
			condition={view.updateDate}
			labelFunction={() => view.getDateLabel('update')}
		/>
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<span class="mb-1 text-lime-800">ページ数</span>
			<div class="flex items-center">
				{#if isEditPageCount}
					<input
						class="flex-grow p-1 mr-1 rounded-lg border-[1px] border-stone-400"
						type="number"
						id="editPageCount"
						bind:value={view.pageCount}
						min="0"
						data-testid="editPageCount"
					/>
				{:else if view.pageCount}
					<span class="flex-grow mb-2 border-b-stone-400 border-b-[1px]">{view.pageCountLabel}</span
					>
				{:else}
					<span class="flex-grow mb-2 text-gray-500 border-b-stone-400 border-b-[1px]"
						>データ無し</span
					>
				{/if}
				<button
					type="button"
					aria-label="btnEditPageCount"
					title="ページ数を編集する"
					class="p-1 mr-1 rounded-full hover:bg-stone-300"
					on:click={() => (isEditPageCount = !isEditPageCount)}
				>
					<Icon icon="mdi:pencil-plus-outline" width="24" height="24" color={colorStone700} />
				</button>
			</div>
		</div>
	</div>
	<span class="py-2 text-lg font-bold">ステータス</span>
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<select
			bind:value={view.status}
			class="w-full p-2 rounded-lg border-[1px] border-stone-400"
			on:change={view.addPageHistoryWhenComplete}
			name="status"
			id="statusSelect"
			data-testid="statusSelect"
		>
			{#each statusItems as item (item.status)}
				<option value={item.status}>{item.label}</option>
			{/each}
		</select>
	</div>
	<span class="py-2 text-lg font-bold">読んだ記録</span>
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		{#if !isValidDate || !isValidCount}
			<span class="text-red-500 font-medium">
				{!isValidDate
					? '日付が未入力です'
					: `ページ数は1～${view.pageCount}ページで入力してください`}
			</span>
		{/if}
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<ul class="flex flex-col rounded">
				{#if view.pageHistories && view.pageHistories.length > 0}
					{#each view.pageHistories as item (item.value.id)}
						<li class="my-1 flex">
							<button
								type="button"
								aria-label="btnDeletePageHistory"
								class="p-1 mr-1 rounded-full hover:bg-stone-300"
								on:click={() => view.deletePageHistory(item.value.id)}
							>
								<Icon icon="ph:x" width="24" height="24" color={colorStone700} />
							</button>
							<div
								class="flex flex-grow justify-between items-center border-b-lime-700 border-b-[1px]"
							>
								<span>{item.convertDateToString()}</span>
								<span>{item.value.pageCount}ページ</span>
							</div>
						</li>
					{/each}
				{:else}
					<li class="my-1 text-right">
						<span class="text-gray-400">記録無し</span>
					</li>
				{/if}
			</ul>
		</div>
		<div class="mb-1 text-right flex justify-end max-sm:flex-col max-sm:items-end">
			<input
				class="p-1 rounded-lg mr-1 max-sm:mb-1 border-[1px] border-stone-400"
				type="date"
				name="readingDate"
				id="readingDate"
				bind:value={readingDate}
				data-testid="dateInput"
			/>
			<div class="max-sm:mb-1 flex items-center justify-end">
				<input
					class="w-16 p-1 mr-1 rounded-lg border-[1px] border-stone-400"
					type="number"
					name="readingCount"
					id="readingCount"
					min="1"
					max={view.pageCount}
					bind:value={readingCount}
					data-testid="countInput"
				/>
				<span>ページ</span>
			</div>
		</div>
		<div class="mb-2 text-right">
			<button
				class="h-8 px-2.5 py-1 mx-0.5 text-stone-700 bg-stone-300 border border-stone-700 duration-150 hover:bg-stone-200 rounded-full"
				on:click={() => view.addPageHistory(readingDate, readingCount)}
				data-testid="btnAdd"
			>
				追加
			</button>
		</div>
	</div>
	<span class="py-2 text-lg font-bold">メモ</span>
	<div>
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<textarea
				class="m-2 px-2 py-1 h-28 rounded-xl border-[1px] border-stone-400 bg-gray-100"
				bind:value={view.memorandum}
				placeholder="メモ、感想など"
				spellcheck="true"
				aria-label="memorandum"
				data-testid="memoInput"
			/>
		</div>
	</div>
</div>
<div class="wrap-default">
	<SvelteToast target={toastTargetName} />
</div>

<style>
	@media not all and (min-width: 640px) {
		.max-sm\:overflow-unset {
			overflow: unset;
		}
	}
	.customScroll::-webkit-scrollbar {
		width: 8px;
	}
	.customScroll::-webkit-scrollbar-thumb {
		background-color: gray;
		border-radius: 20px;
	}
</style>
