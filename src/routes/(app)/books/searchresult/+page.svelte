<script lang="ts">
    import BookAdd from '$lib/icons/BookAdd.svelte';
	import ContentHeader from '$lib/components/app/ContentHeader.svelte';
    import type { PageData } from './$types';
	import PrimalyButton from '$lib/components/parts/PrimalyButton.svelte';
	import SearchModal from '$lib/components/app/SearchModal.svelte';
	import type { books_v1 } from 'googleapis';
	import Icon from '@iconify/svelte';
   
    export let data: PageData;
    let isDisplaySearchModal = false;
    let resultCount = 0;
    let startIndex = 0;
    let isLoading = false;
    const colorStone700 = '#44403C';

    let runPromise = async (): Promise<books_v1.Schema$Volumes> => {
        isLoading = true;
        const result = await data.getBookInfo();
        isLoading = false;
        resultCount = result.totalItems!;
        return result;
    }
    $: {
        //再検索時に再実行されるようreactive化
        runPromise = async (): Promise<books_v1.Schema$Volumes> => {
            isLoading = true;
            //ページングを初期化
            startIndex = 0; 
            resultCount = 0;
            const result = await data.getBookInfo();
            resultCount = result.totalItems!;
            isLoading = false;
            return result;
        }
    }

    /**後方にページング*/
    let pagingBackward = (e: MouseEvent) => {};
    $: {
        pagingBackward = (e: MouseEvent) => {
            if (startIndex === 0){
                e.preventDefault();
                return;
            }
            startIndex -= 10;
            isLoading = true;
            runPromise = async (): Promise<books_v1.Schema$Volumes> => {
                const result = await data.getBookInfo(startIndex);
                isLoading = false;
                return result;
            }
        }
    }

    /**前方にページング*/
    let pagingForward = (e: MouseEvent) => {};
    $: {
        pagingForward = (e: MouseEvent) => {
            if ((startIndex + 10) >= resultCount){
                e.preventDefault();
                return;
            }
            startIndex += 10;
            isLoading = true;
            runPromise = async (): Promise<books_v1.Schema$Volumes> => {
                const result = await data.getBookInfo(startIndex);
                isLoading = false;
                return result;
            }
        }
    }
</script>

<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
	<ContentHeader headerIcon={BookAdd} headerText="書籍検索" isDisplayAddButton={false} />
    <div class="flex justify-between">
        <PrimalyButton type='button' text='再検索' isUseMargin={false} on:click={() => isDisplaySearchModal = !isDisplaySearchModal}/>
        <div class="flex">      
            <button type="button" on:click={e => pagingBackward(e)} disabled={isLoading}>
                <Icon icon="ph:caret-circle-left-light" width="32" height="32" color={colorStone700} />
            </button>   
            <span class="m-auto px-2">{`${resultCount? startIndex + 1 : 0 }～${(startIndex + 10) >= resultCount ? resultCount : (startIndex + 10)}/${resultCount}`}件</span>
            <button type="button" on:click={e => pagingForward(e)} disabled={isLoading}>
                <Icon icon="ph:caret-circle-right-light" width="32" height="32" color={colorStone700} />
            </button>
        </div>        
    </div>
    <SearchModal bind:isDisplay={isDisplaySearchModal} action=''/>
</div>
<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
    {#await runPromise()}
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
                            class="self-center w-[128px] h-[182px]"
                            src={item.volumeInfo?.imageLinks?.thumbnail}
                            alt="test"
                        />						
                    {:else}
                        <div class="self-center flex justify-center items-center w-[128px] h-[182px] bg-slate-300">
                            <span>No Image</span>
                        </div>
                    {/if}
                    <div class="p-2 flex flex-col">
                        <span class="font-bold text-lime-700">{item.volumeInfo?.title ?? 'データ無し'}</span>
                        <div class="p-2 flex flex-col">
                            <span>著者：{item.volumeInfo?.authors?.join(', ') ?? 'データ無し'}</span>
                            <span>ページ数：{item.volumeInfo?.pageCount ?? 'データ無し'}</span>
                            <span>発売日：{item.volumeInfo?.publishedDate ?? 'データ無し'}</span>
                            <div class="p-2">
                                <p class="collapseDescription">{item.volumeInfo?.description ?? ''}</p>
                            </div>
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