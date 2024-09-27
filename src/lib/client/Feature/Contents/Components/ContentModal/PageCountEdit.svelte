<script lang="ts">
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import Icon from '@iconify/svelte';

	export let bookInfo: BookInfo;

	let isEditPageCount = false;
</script>

<div class="mb-2 flex flex-col justify-start items-stretch">
	<span class="mb-1 text-lime-800">ページ数</span>
	<div class="flex items-center">
		{#if isEditPageCount}
			<input
				class="flex-grow p-1 mr-1 rounded-lg border-[1px] border-stone-400"
				type="number"
				id="editPageCount"
				bind:value={bookInfo.pageCount}
				min="0"
				data-testid="editPageCount"
			/>
		{:else if bookInfo.pageCount}
			<span class="flex-grow mb-2 border-b-stone-400 border-b-[1px]">
				{`${bookInfo.pageCount}ページ`}
			</span>
		{:else}
			<span class="flex-grow mb-2 text-gray-500 border-b-stone-400 border-b-[1px]">データ無し</span>
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
