<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { convertDate } from '$lib/utils/bookInfo';
	import { pushToast } from '$lib/utils/toast';
	import { validateReadingCount, validateReadingDate } from '$lib/utils/validation';
	import CategoryLabel from '$lib/components/common/parts/CategoryLabel.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { toastTargetName } from '$lib/client/Helpers/Toast';
	import { colorStone700 } from '$lib/client/UI/Shared/StaticValues';

	export let bookInfo: BookInfo;

	let isEditPageCount = false;
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
	];

	/**読んだ記録を追加する*/
	const addHistory = () => {
		isValidDate = validateReadingDate(readingDate);
		isValidCount = validateReadingCount(readingCount, bookInfo.pageCount);
		if (!isValidDate || !isValidCount) {
			return;
		}

		const item = {
			id: crypto.randomUUID(),
			date: convertReadingDateToDate(),
			currentPage: readingCount
		};
		if (bookInfo.pageHistory) {
			bookInfo.pageHistory.push(item);
		} else {
			bookInfo.pageHistory = [item];
		}

		//読んだ記録と現在のステータスが一致しない場合に自動で変更する。
		let toastMessage = '';
		if (bookInfo.status === 'wish' && bookInfo.pageHistory.length === 1) {
			bookInfo.status = 'reading';
			toastMessage = 'ステータスを「読んでいる本」に変更しました。';
		} else if (bookInfo.status !== 'complete' && readingCount === bookInfo.pageCount) {
			bookInfo.status = 'complete';
			toastMessage = 'ステータスを「読み終わった本」に変更しました。';
		}

		readingDate = setCurrentDate();
		readingCount = 0;
		//追加した記録を反映させるため変更を通知
		bookInfo = bookInfo;

		//入力値の自動変更があればトーストで通知。
		if (toastMessage) {
			pushToast(toastMessage, toastTargetName);
		}
	};

	/**読んだ記録を削除する*/
	const deletePageHistory = (id: string) => {
		if (bookInfo.pageHistory) {
			bookInfo.pageHistory = bookInfo.pageHistory.filter((item) => item.id !== id);
		}
	};

	/**inputタグの日付をDateに変換*/
	const convertReadingDateToDate = () => {
		const splitDate = readingDate.split('-');
		//UTCで設定する
		return new Date(
			Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]))
		);
	};

	/**読んだ記録に最終ページの記録があるか*/
	const isExistCompleteHistory = () => {
		if (!bookInfo.pageHistory) {
			return false;
		}

		let isExist = false;
		bookInfo.pageHistory!.forEach((item) => {
			if (item.currentPage === bookInfo.pageCount) {
				isExist = true;
			}
		});

		return isExist;
	};

	/**ステータスがcompleteに変更された際に、最終ページまでの記録が無ければ追加する。*/
	const isChangedToComplete = () => {
		if (bookInfo.status !== 'complete' || isExistCompleteHistory()) {
			return;
		}

		readingDate = setCurrentDate();
		readingCount = bookInfo.pageCount;
		addHistory();

		pushToast('最後のページまでの読んだ記録を追加しました。', toastTargetName);
	};

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
		<CategoryLabel
			categoryText="著者"
			condition={bookInfo.author}
			labelFunction={() => bookInfo.author?.join(', ')}
		/>
		<CategoryLabel
			categoryText="登録日"
			condition={bookInfo.createDate}
			labelFunction={() => convertDate(bookInfo.createDate)}
		/>
		<CategoryLabel
			categoryText="最終更新日"
			condition={bookInfo.updateDate}
			labelFunction={() => convertDate(bookInfo.updateDate)}
		/>
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
					<span class="flex-grow mb-2 border-b-stone-400 border-b-[1px]"
						>{bookInfo.pageCount.toString() + 'ページ'}</span
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
			bind:value={bookInfo.status}
			class="w-full p-2 rounded-lg border-[1px] border-stone-400"
			on:change={isChangedToComplete}
			name="status"
			id="statusSelect"
			data-testid="statusSelect"
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
				{!isValidDate
					? '日付が未入力です'
					: `ページ数は1～${bookInfo.pageCount}ページで入力してください`}
			</span>
		{/if}
		<div class="mb-2 flex flex-col justify-start items-stretch">
			<ul class="flex flex-col rounded">
				{#if bookInfo.pageHistory && bookInfo.pageHistory.length > 0}
					{#each bookInfo.pageHistory as item (item.id)}
						<li class="my-1 flex">
							<button
								type="button"
								aria-label="btnDeletePageHistory"
								class="p-1 mr-1 rounded-full hover:bg-stone-300"
								on:click={() => deletePageHistory(item.id)}
							>
								<Icon icon="ph:x" width="24" height="24" color={colorStone700} />
							</button>
							<div
								class="flex flex-grow justify-between items-center border-b-lime-700 border-b-[1px]"
							>
								<span>{convertDate(item.date)}</span>
								<span>{item.currentPage}ページ</span>
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
					max={bookInfo.pageCount}
					bind:value={readingCount}
					data-testid="countInput"
				/>
				<span>ページ</span>
			</div>
		</div>
		<div class="mb-2 text-right">
			<button
				class="h-8 px-2.5 py-1 mx-0.5 text-stone-700 bg-stone-300 border border-stone-700 duration-150 hover:bg-stone-200 rounded-full"
				on:click={addHistory}
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
