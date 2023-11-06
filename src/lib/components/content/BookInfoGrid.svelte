<script lang="ts">
	//import { page } from '$app/stores';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { getThumbnailByIsbn } from '$lib/GoogleBooksAPI/RequestManage';
	import { createEventDispatcher } from 'svelte';
	import { convertDate } from '$lib/utils';

	export let bookInfos: BookInfo[];
	/**表示する本が無い場合のメッセージ*/
	export let emptyMessage = '本が登録されていません。<br>右上の追加ボタンから本を検索して登録してください！';
	
	//todo ページに応じて表示を切り替える。
	//const pathName = $page.url.pathname;

	const isExistDisplayableItems = (bookInfos: BookInfo[]): boolean => {
		if (!bookInfos || bookInfos.length === 0) { return false }
		
		const visibleCount = bookInfos.filter(item => item.isVisible).length;
		if (visibleCount === 0) { return false; }
		
		return true;
	}
	
	/**書影を取得する(gapi固有の情報なので保存せず都度取得)*/
	const setThumbnail = async (bookInfo: BookInfo) => {
		//画面の再レンダリング時は取得済みなので実行しない。
		if (!bookInfo.thumbnail) { bookInfo.thumbnail = await getThumbnailByIsbn(bookInfo.identifier?.isbn_13!); }
	};

	const dispatch = createEventDispatcher();
	const handleClick = (item: BookInfo) => {
		dispatch('click', item);
	};
</script>


{#if isExistDisplayableItems(bookInfos) }
	<ul
		class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
	>
		{#each bookInfos as bookInfo (bookInfo._id)}
			{#if bookInfo.isVisible}
				<li style="display: inherit;" title={bookInfo.title}>
					<button
						class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
						on:click={() => handleClick(bookInfo)}
					>
						{#await setThumbnail(bookInfo)}
							<div
								class="justify-self-center self-center flex items-center justify-center w-[128px] h-[182px] border border-slate-300"
							>
								<span
									class="animate-spin w-10 h-10 border-4 border-lime-600 rounded-full border-t-transparent"
								/>
							</div>
						{:then}
							{#if bookInfo.thumbnail}
								<img
									class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300"
									src={bookInfo.thumbnail}
									alt="test"
								/>
							{:else}
								<div
									class="max-sm:hidden justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
								>
									<span>No Image</span>
								</div>
								<div
									class="hidden max-sm:flex justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
								>
									<span class="p-1 break-all collapseTitle">{bookInfo.title}</span>
								</div>
							{/if}
						{:catch}
							<div
								class="max-sm:hidden justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
							>
								<span>No Image</span>
							</div>
							<div
								class="hidden max-sm:flex justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
							>
								<span class="p-1 break-all collapseTitle">{bookInfo.title}</span>
							</div>
						{/await}
						<div class="max-sm:hidden">
							<sp class="text-left px-2 text-lime-700 break-all collapseTitle">{bookInfo.title}</sp>
						</div>
						<div class="self-center flex justify-between max-sm:hidden">
							<span class="pl-2 text-xs">登録日</span>
							<span class="pr-2 text-sm">{convertDate(bookInfo.createDate)}</span>
						</div>
					</button>
				</li>
			{/if}
		{/each}
	</ul>
{:else}
	<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
{/if}


<style>
	.collapseTitle {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
</style>