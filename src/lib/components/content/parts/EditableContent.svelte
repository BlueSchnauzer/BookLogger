<script lang="ts">
	import type { BookInfo } from "$lib/server/models/BookInfo";
	import { convertDate, pushToast, validateReadingCount, validateReadingDate } from "$lib/utils";
	import CategoryLabel from "$lib/components/common/parts/CategoryLabel.svelte";
	import { SvelteToast, toast } from "@zerodevx/svelte-toast";
	import { onMount } from "svelte";

	export let bookInfo: BookInfo;

	const date = new Date();
	const setCurrentDate = () =>
		`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
	let readingDate = setCurrentDate();
	let readingCount: number;
	let isValidDate = true;
	let isValidCount = true;
	const statusList = [
		{ status: 'wish', label: '読みたい本' },
		{ status: 'reading', label: '読んでいる本' },
		{ status: 'complete', label: '読み終わった本' }
	]
	const target = 'modalToast';
	
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

		//読んだ記録と現在のステータスが一致しない場合に自動で変更する。
		let toastMessage = '';
		if (bookInfo.status === 'wish' && bookInfo.history.length === 1) {
			bookInfo.status = 'reading';
			toastMessage = 'ステータスを「読んでいる本」に変更しました。';
		}	else if (bookInfo.status !== 'complete' && readingCount === bookInfo.pageCount) {
			bookInfo.status = 'complete';
			toastMessage = 'ステータスを「読み終わった本」に変更しました。';
		}

		readingDate = setCurrentDate();
		readingCount = 0;
		//追加した記録を反映させるため変更を通知
		bookInfo = bookInfo;

		//入力値の自動変更があればトーストで通知。
		if (toastMessage) { pushToast(toastMessage, target); }
	};

	/**inputタグの日付をDateに変換*/
	const convertReadingDateToDate = () => {
		const splitDate = readingDate.split('-');
		return new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
	};

	/**読んだ記録に最終ページの記録があるか*/
	const isExistCompleteHistory = () => {
		if (!bookInfo.history) { return false; }

		let isExist = false;
		bookInfo.history!.forEach(item => {
			if (item.currentPage === bookInfo.pageCount) { isExist = true; }
		})

		return isExist;
	}

	/**ステータスがcompleteに変更された際に、最終ページまでの記録が無ければ追加する。*/
	const isChangedToComplete = () => {
		if (bookInfo.status !== 'complete' || isExistCompleteHistory()) { return; }

		readingDate = setCurrentDate();
		readingCount = bookInfo.pageCount;
		addHistory();

		pushToast('最後のページまでの読んだ記録を追加しました。', target);
	}

	onMount(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<div class="flex flex-col flex-grow p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll">
	{#if bookInfo.title}
		<span class="py-2 text-lg font-bold text-lime-700">{bookInfo.title}</span>
	{:else}
		<span class="py-2 text-lg font-bold text-gray-400">データ無し</span>
	{/if}
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<CategoryLabel categoryText="著者" condition={bookInfo.author}
			labelFunction={() => bookInfo.author?.join(', ')}
		/>
		<CategoryLabel categoryText="登録日" condition={bookInfo.createDate}
			labelFunction={() => convertDate(bookInfo.createDate)}
		/>
		<CategoryLabel categoryText="最終更新日" condition={bookInfo.updateDate}
			labelFunction={() => convertDate(bookInfo.updateDate)}
		/>
		<CategoryLabel categoryText="ページ数" condition={bookInfo.pageCount}
			labelFunction={() => bookInfo.pageCount.toString() + 'ページ'}
		/>
	</div>
	<span class="py-2 text-lg font-bold">ステータス</span>
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		<select bind:value={bookInfo.status} class="w-full p-2 rounded-lg border-[1px] border-stone-400" 
			on:change={isChangedToComplete}
			name="status" id="statusSelect" data-testid="statusSelect"
		>
			{#each statusList as item (item.status)}
				<option value={item.status}>{item.label}</option>
			{/each}
		</select>
	</div>
	<span class="py-2 text-lg font-bold">読んだ記録</span>
	<div class="p-3 m-2 rounded-xl border-[1px] border-stone-400 bg-gray-100">
		{#if !isValidDate || !isValidCount}
			<span class="text-red-500 font-medium">
				{!isValidDate	? '日付が未入力です' : `ページ数は1～${bookInfo.pageCount}ページで入力してください`}
			</span>
		{/if}
		<div
			class="mb-2 flex flex-col justify-start items-stretch"
		>
			<ul class="flex flex-col rounded">
				{#if bookInfo.history && bookInfo.history.length > 0}
					{#each bookInfo.history as item}
						<li class="my-1 flex justify-between items-center border-b-lime-700 border-b-[1px]">
							<span>{convertDate(item.date)}</span>
							<span>{item.currentPage}ページ</span>
						</li>
					{/each}
				{:else}
					<li class="my-1 text-right">
						<span class="text-gray-400">記録無し</span>
					</li>
				{/if}
			</ul>
		</div>
		<div class="mb-1 text-right">
			<input class="p-1 rounded-lg mr-1 border-[1px] border-stone-400" type="date" name="readingDate"
				id="readingDate" bind:value={readingDate}	data-testid="dateInput"
			/>
			<input class="w-16 p-1 rounded-lg border-[1px] border-stone-400" type="number" name="readingCount"
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
	</div>
	<span class="py-2 text-lg font-bold">メモ</span>
	<div>
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<textarea	class="m-2 px-2 py-1 h-28 rounded-xl border-[1px] border-stone-400 bg-gray-100" 
				bind:value={bookInfo.memorandum} placeholder="メモ、感想など" spellcheck="true" aria-label="memorandum" data-testid="memoInput"
			/>
		</div>
	</div>
</div>
<div class="wrap-default">
	<SvelteToast {target}/>
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