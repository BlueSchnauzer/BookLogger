<script lang="ts">
	import type { BookInfo } from "$lib/server/models/BookInfo";
	import { convertDate } from "$lib/utils";

    export let bookInfo: BookInfo;

    const date = new Date();
    const setCurrentDate = () => `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    let readingDate = setCurrentDate();
    let readingCount: number;
    let dateError = false;
    let countError = false;
    
    const getLabel = (data?: string | number): string => {
        return data?.toString() ?? 'データ無し';
	};

    /**inputタグの日付をDateに変換*/
    const convertReadingDateToDate = () => {
        const splitDate = readingDate.split('-');
        return new Date(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2]));
    }

    /**読んだ記録を追加する*/
    const addHistory = () => {
        if (!readingDate) {
            dateError = true;
            return;
        }
        if (!readingCount || readingCount < 0 || 10000 <= readingCount) {
            countError = true;
            return;
        }

        const item = {
            date: convertReadingDateToDate(),
            currentPage: readingCount
        }
        if (bookInfo.history) {
            bookInfo.history.push(item);
        }
        else {
            bookInfo.history = [item];
        }

        dateError = false;
        countError = false;
        readingDate = setCurrentDate();
        readingCount = 0;
        bookInfo = bookInfo;
    }

</script>

<div class="flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
    <div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
        {#if bookInfo.thumbnail}
            <img
                class="self-center w-[128px] h-[182px] shadow-md"
                title={getLabel(bookInfo.title)}
                src={bookInfo.thumbnail}
                alt="書影"
            />
        {:else}
            <div
                class="flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
                title={getLabel(bookInfo.title)}
            >
                <span>No Image</span>
            </div>
        {/if}
    </div>
    <span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
    <div class="flex flex-col flex-grow p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll">
        {#if bookInfo.title}
            <span class="pt-2 text-lg font-bold text-lime-700">{bookInfo.title}</span>
        {:else}
            <span class="pt-2 text-lg font-bold text-gray-400">データ無し</span>
        {/if}
        <div class="flex-1">
            <div class="p-2">
                <div class="mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                    <span class="font-medium">著者名</span>
                    <span class="max-sm:self-end">{bookInfo.author.join(',')}</span>
                </div>
                <div class="mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                    <span class="font-medium">ページ数</span>
                    <span class="max-sm:self-end">{bookInfo.pageCount}ページ</span>
                </div>
                <div class="mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                    <span class="font-medium">登録日</span>
                    <span class="max-sm:self-end">{convertDate(bookInfo.createDate)}</span>
                </div>
                <div class="mb-2 flex justify-between max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
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
                {#if dateError || countError}
                    <span class="text-red-500 font-medium">{dateError ? '日付が未入力です' : 'ページ数が不正です'}</span>
                {/if}
                <div class="mb-1 text-right">
                    <input class="p-1 rounded-lg mr-1" type="date" name="readingDate" id="readingDate" bind:value={readingDate} data-testid="dateInput">
                    <input class="w-16 p-1 rounded-lg" type="number" name="readingCount" id="readingCount" min="0" max="9999" bind:value={readingCount} data-testid="countInput">
                    <span>ページ</span>
                </div>
                <div class="mb-2 text-right">
                    <button class="h-8 px-2.5 py-1 mx-0.5 text-stone-700 bg-stone-300 border border-stone-700 duration-150 hover:bg-stone-200 rounded-full"
                    on:click={addHistory}>
                    追加
                    </button>
                </div>
                <div class="mb-2 flex flex-col max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                    <span class="max-sm:mb-2 font-medium">メモ</span>
                    <textarea class="m-2 px-2 py-1 h-28 rounded" bind:value={bookInfo.memorandum} aria-label="memorandum" data-testid="memoInput"></textarea>
                </div>
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