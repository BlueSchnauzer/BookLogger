<script lang="ts">
    import BookAdd from '$lib/icons/BookAdd.svelte';
	import ContentHeader from '$lib/components/app/ContentHeader.svelte';
    import type { PageData } from './$types';
	import { getBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
	import type { books_v1 } from 'googleapis';
   
    export let data: PageData;
    const promise = getBookInfosByQueries(data.bookTitle!, data.author!, data.isbn!) as books_v1.Schema$Volumes;

</script>

<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
	<ContentHeader headerIcon={BookAdd} headerText="書籍検索" isDisplayAddButton={false} />
    <div class="py-2">
        <span class="font-medium">検索結果</span>
    </div>    
</div>
<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
    {#await promise}
        <div class="flex flex-1 justify-center items-center">
            <span class="animate-spin w-14 h-14 border-4 border-lime-600 rounded-full border-t-transparent"></span>
        </div>
    {:then result} 
        {#if result.items}
            <ul>
            {#each result.items as item}
                <li class="p-2 my-2 flex bg-gray-100 rounded-lg shadow-md">
                    {#if item.volumeInfo?.imageLinks?.thumbnail}
                        <img
                            class="w-[128px] h-[182px]"
                            src={item.volumeInfo?.imageLinks?.thumbnail}
                            alt="test"
                        />						
                    {:else}
                        <div class="w-[128px] h-[182px] bg-slate-300">
                            <span>No Image</span>
                        </div>
                    {/if}
                    <div class="p-2 flex flex-col">
                        <span>タイトル：{item.volumeInfo?.title}</span>
                        <span>ページ数：{item.volumeInfo?.pageCount}</span>
                        <span>発売日：{item.volumeInfo?.publishedDate}</span>
                        <div class="p-2">
                            <p class="collapseDescription">{item.volumeInfo?.description ?? ''}</p>
                        </div>
                    </div>
                </li>
            {/each}
            </ul>  
        {/if}
    {:catch error}
        <span class="text-red-500 font-medium">{error.message}</span>
    {/await}
</div>

<style>
	.contentHeight {
        height: calc(100% - 96px);
    }
	.collapseDescription {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
    .customScroll::-webkit-scrollbar {
        width: 8px;
    }
    .customScroll::-webkit-scrollbar-thumb {
        background-color: gray;
        border-radius: 20px;
    }
</style>