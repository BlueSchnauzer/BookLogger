<script lang="ts">
	import { getCurrentDateString } from '$lib/client/Shared/Helpers/Date';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import Icon from '@iconify/svelte';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { bookInfoStore } from '$lib/client/Feature/Contents/store';

	export let bookInfo: BookInfo;

	const store = bookInfoStore(bookInfo);
	const storedValue = $store;

	let readingDate = getCurrentDateString();
	let readingCount: number;

	let pageHistoryValidation: { isError: boolean; errorMessage?: string } = {
		isError: false,
		errorMessage: ''
	};

	const handleAddPageHistory = () => {
		pageHistoryValidation = store.addPageHistory(readingDate, readingCount);
	};
</script>

<span class="py-2 text-lg font-bold">読んだ記録</span>
<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
	{#if pageHistoryValidation.isError}
		<span class="text-red-500 font-medium">
			{pageHistoryValidation.errorMessage}
		</span>
	{/if}
	<div class="mb-2 flex flex-col justify-start items-stretch">
		<ul class="flex flex-col rounded">
			{#if storedValue.pageHistories && storedValue.pageHistories.length > 0}
				{#each storedValue.pageHistories as pageHistory (pageHistory.value.id)}
					<li class="my-1 flex">
						<button
							type="button"
							aria-label="btnDeletePageHistory"
							class="p-1 mr-1 rounded-full hover:bg-stone-300"
							on:click={() => store.deletePageHistory(pageHistory.value.id)}
						>
							<Icon icon="ph:x" width="24" height="24" color={colorStone700} />
						</button>
						<div
							class="flex flex-grow justify-between items-center border-b-lime-700 border-b-[1px]"
						>
							<span>{pageHistory.convertDateToString()}</span>
							<span>{pageHistory.value.pageCount}ページ</span>
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
				max={storedValue.pageCount}
				bind:value={readingCount}
				data-testid="countInput"
			/>
			<span>ページ</span>
		</div>
	</div>
	<div class="mb-2 text-right">
		<button
			class="h-8 px-2.5 py-1 mx-0.5 text-stone-700 bg-stone-300 border border-stone-700 duration-150 hover:bg-stone-200 rounded-full"
			on:click={handleAddPageHistory}
			data-testid="btnAdd"
		>
			追加
		</button>
	</div>
</div>
