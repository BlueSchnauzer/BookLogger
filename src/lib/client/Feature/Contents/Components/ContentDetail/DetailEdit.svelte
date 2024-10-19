<script lang="ts">
	import { statusItems } from '$lib/client/Shared/Constants/MenuItems';
	import PageCountEdit from '$lib/client/Feature/Contents/Components/ContentDetail/PageCountEdit.svelte';
	import PageHistoryEdit from '$lib/client/Feature/Contents/Components/ContentDetail/PageHistoryEdit.svelte';
	import CategoryLabel from '$lib/client/Shared/Components/CategoryLabel.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { getDateLabel, joinAuthorNames } from '$lib/client/Feature/Contents/DataView/dataView';
	import { bookInfoStore } from '$lib/client/Feature/Contents/store';
	import NotificationToast from '$lib/client/Shared/Components/Toast/NotificationToast.svelte';

	export let store: ReturnType<typeof bookInfoStore>;
	export let storedValue: BookInfo;

	onMount(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<div
	class="flex flex-col flex-grow p-4 max-sm:pt-0 max-sm:overflow-unset overflow-auto customScroll"
>
	{#if storedValue.title}
		<span class="py-2 text-lg font-bold text-lime-700">{storedValue.title}</span>
	{:else}
		<span class="py-2 text-lg font-bold text-gray-400">データ無し</span>
	{/if}
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<CategoryLabel categoryText="著者" displayText={joinAuthorNames(storedValue.author)} />
		<CategoryLabel categoryText="登録日" displayText={getDateLabel(storedValue.createDate)} />
		<CategoryLabel categoryText="最終更新日" displayText={getDateLabel(storedValue.updateDate)} />
		<PageCountEdit {storedValue} />
	</div>
	<span class="py-2 text-lg font-bold">ステータス</span>
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<select
			bind:value={storedValue.status.value}
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
	<PageHistoryEdit {store} {storedValue} />
	<span class="py-2 text-lg font-bold">メモ</span>
	<div>
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<textarea
				class="m-2 px-2 py-1 h-28 rounded-xl border-[1px] border-stone-400 bg-gray-100"
				bind:value={storedValue.memorandum}
				placeholder="メモ、感想など"
				spellcheck="true"
				aria-label="memorandum"
				data-testid="memoInput"
			/>
		</div>
	</div>
</div>
<NotificationToast />

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
