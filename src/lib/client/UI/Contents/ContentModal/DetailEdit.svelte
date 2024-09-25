<script lang="ts">
	import { modalToastTarget } from '$lib/client/Shared/Helpers/Toast';
	import { statusItems } from '$lib/client/Shared/Constants/MenuItems';
	import PageCountEdit from '$lib/client/UI/Contents/ContentModal/PageCountEdit.svelte';
	import PageHistoryEdit from '$lib/client/UI/Contents/ContentModal/PageHistoryEdit.svelte';
	import CategoryLabel from '$lib/client/Shared/Components/CategoryLabel.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
	import { getDateLabel, joinAuthorNames } from '$lib/client/Feature/Contents/DataView/dataView';
	import { bookInfoStore } from '$lib/client/Feature/Contents/store';

	export let bookInfo: BookInfo;
	let store = bookInfoStore(bookInfo);
	let storedValue = $store;

	onMount(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<div
	class="flex flex-col flex-grow p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll"
>
	{#if bookInfo.title}
		<span class="py-2 text-lg font-bold text-lime-700">{bookInfo.title}</span>
	{:else}
		<span class="py-2 text-lg font-bold text-gray-400">データ無し</span>
	{/if}
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<CategoryLabel categoryText="著者" displayText={joinAuthorNames(bookInfo.author)} />
		<CategoryLabel categoryText="登録日" displayText={getDateLabel(bookInfo.createDate)} />
		<CategoryLabel categoryText="最終更新日" displayText={getDateLabel(bookInfo.updateDate)} />
		<PageCountEdit bind:bookInfo />
	</div>
	<span class="py-2 text-lg font-bold">ステータス</span>
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<select
			bind:value={bookInfo.status.value}
			class="w-full p-2 rounded-lg border-[1px] border-stone-400"
			on:change={store.addPageHistoryWhenComplete}
			name="status"
			id="statusSelect"
			data-testid="statusSelect"
		>
			{#each statusItems as item (item.status)}
				<option value={item.status}>{item.label}</option>
			{/each}
		</select>
	</div>
	<PageHistoryEdit bind:bookInfo />
	<span class="py-2 text-lg font-bold">メモ</span>
	<div>
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<textarea
				class="m-2 px-2 py-1 h-28 rounded-xl border-[1px] border-stone-400 bg-gray-100"
				bind:value={bookInfo.memorandum}
				placeholder="メモ、感想など"
				spellcheck="true"
				aria-label="memorandum"
				data-testid="memoInput"
			/>
		</div>
	</div>
</div>
<div class="wrap-default">
	<SvelteToast target={modalToastTarget} />
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
