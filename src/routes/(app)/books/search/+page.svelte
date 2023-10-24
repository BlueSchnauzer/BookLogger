<script lang="ts">
    import type { PageData } from './$types';
	import type { books_v1 } from 'googleapis';
	import Icon from '@iconify/svelte';
    import BookAdd from '$lib/icons/BookAdd.svelte';
	import PrimalyButton from '$lib/components/parts/PrimalyButton.svelte';
	import ContentHeader from '$lib/components/app/ContentHeader.svelte';
	import SearchModal from '$lib/components/app/SearchModal.svelte';
    import SearchResult from '../../../../lib/components/app/SearchResult.svelte';
   
    export let data: PageData;
    let isDisplaySearchModal = false;
    let resultCount = 0;
    let startIndex = 0;
    let isLoading = false;
    const colorLime800 = '#3F6212';

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
            runPromise = async (): Promise<books_v1.Schema$Volumes> => {
                isLoading = true;
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
            runPromise = async (): Promise<books_v1.Schema$Volumes> => {
                isLoading = true;
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
            <button class="hover:bg-stone-300 rounded" type="button" on:click={e => pagingBackward(e)} disabled={isLoading}>
                <Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
            </button>   
            <span class="m-auto px-2">{`${resultCount? startIndex + 1 : 0 }～${(startIndex + 10) >= resultCount ? resultCount : (startIndex + 10)}/${resultCount}`}件</span>
            <button class="hover:bg-stone-300 rounded" type="button" on:click={e => pagingForward(e)} disabled={isLoading}>
                <Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
            </button>
        </div>        
    </div>
    <SearchModal bind:isDisplay={isDisplaySearchModal} action=''/>
</div>
<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
<div class="flex flex-col p-1 contentHeight overflow-auto customScroll">
    <SearchResult runPromise={runPromise}></SearchResult>
</div>

<style>
	.contentHeight {
        height: calc(100% - 96px);
    }
    .customScroll::-webkit-scrollbar {
        width: 8px;
    }
    .customScroll::-webkit-scrollbar-thumb {
        background-color: gray;
        border-radius: 20px;
    }
</style>