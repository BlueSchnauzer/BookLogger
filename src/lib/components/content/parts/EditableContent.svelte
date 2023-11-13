<script lang="ts">
	import type { BookInfo } from "$lib/server/models/BookInfo";
	import { convertDate, validateReadingCount, validateReadingDate } from "$lib/utils";
	import CategoryLabel from "$lib/components/common/parts/CategoryLabel.svelte";

	export let bookInfo: BookInfo;

	const date = new Date();
	const setCurrentDate = () =>
		`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
	let readingDate = setCurrentDate();
	let readingCount: number;
	let isValidDate = true;
	let isValidCount = true;

	/**inputタグの日付をDateに変換*/
	const convertReadingDateToDate = () => {
		const splitDate = readingDate.split('-');
		return new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
	};

	/**読んだ記録を追加する*/
	const addHistory = () => {
		isValidDate = validateReadingDate(readingDate);
		isValidCount = validateReadingCount(readingCount, bookInfo.pageCount);
		if (!isValidDate || !isValidCount) { return; }

		const item = {
			date: convertReadingDateToDate(),
			currentPage: readingCount
		};
		if (bookInfo.history) {
			bookInfo.history.push(item);
		} else {
			bookInfo.history = [item];
		}

		readingDate = setCurrentDate();
		readingCount = 0;
		//追加した記録を反映させるため変更を通知
		bookInfo = bookInfo;
	};

</script>

<div class="flex flex-col flex-grow p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll">
	<div class="flex-1">
		<div class="p-2">
			<CategoryLabel categoryText="タイトル" condition={bookInfo.title} 
				labelFunction={() => bookInfo.title}
			/>
			<CategoryLabel categoryText="著者" condition={bookInfo.author}
        labelFunction={() => bookInfo.author?.join(', ')}
			/>
			<CategoryLabel categoryText="登録日" condition={bookInfo.pageCount}
				labelFunction={() => convertDate(bookInfo.createDate)}
			/>
			<CategoryLabel categoryText="最終更新日" condition={bookInfo.pageCount}
				labelFunction={() => convertDate(bookInfo.updateDate)}
			/>
			<CategoryLabel categoryText="ページ数" condition={bookInfo.pageCount}
				labelFunction={() => bookInfo.pageCount.toString() + 'ページ'}
			/>
			<div
				class="mb-2 flex justify-between max-sm:flex-col max-sm:justify-start max-sm:items-stretch"
			>
				<span class="font-medium w-1/3">読んだ記録</span>
				<ul class="flex flex-col w-2/3 rounded max-sm:self-end">
					{#if bookInfo.history && bookInfo.history.length > 0}
						{#each bookInfo.history as item}
							<li class="flex justify-between items-center border-b-lime-700 border-b-[1px]">
								<span>{convertDate(item.date)}</span>
								<span>{item.currentPage}ページ</span>
							</li>
						{/each}
					{:else}
						<li class="text-right">
							<span class="text-gray-400">記録無し</span>
						</li>
					{/if}
				</ul>
			</div>
			{#if !isValidDate || !isValidCount}
				<span class="text-red-500 font-medium">
          {!isValidDate	? '日付が未入力です' : `ページ数は1～${bookInfo.pageCount}ページで入力してください`}
        </span>
			{/if}
			<div class="mb-1 text-right">
				<input class="p-1 rounded-lg mr-1" type="date" name="readingDate"
					id="readingDate" bind:value={readingDate}	data-testid="dateInput"
				/>
				<input class="w-16 p-1 rounded-lg" type="number" name="readingCount"
					id="readingCount"	min="1"	max={bookInfo.pageCount} bind:value={readingCount}	data-testid="countInput"
				/>
				<span>ページ</span>
			</div>
			<div class="mb-2 text-right">
				<button
					class="h-8 px-2.5 py-1 mx-0.5 text-stone-700 bg-stone-300 border border-stone-700 duration-150 hover:bg-stone-200 rounded-full"
					on:click={addHistory}	data-testid="btnAdd"
				>
					追加
				</button>
			</div>
			<div class="mb-2 flex flex-col max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
				<span class="max-sm:mb-2 font-medium">メモ</span>
				<textarea	class="m-2 px-2 py-1 h-28 rounded" 
          bind:value={bookInfo.memorandum} aria-label="memorandum"	data-testid="memoInput"
				/>
			</div>
		</div>
	</div>
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