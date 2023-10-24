<script lang="ts">
	import type { books_v1 } from 'googleapis';
	import { createEventDispatcher } from 'svelte';
    
    export let runPromise: () => Promise<books_v1.Schema$Volumes>;

    const getLabel = (data?: string | number): string => {
        return data?.toString() ?? 'データ無し';
    }
	const dispatch = createEventDispatcher();
	const handleClick = (item: books_v1.Schema$Volume) => {
		dispatch('click', item);
	};

</script>

{#await runPromise()}
    <div class="flex flex-1 justify-center items-center">
        <span class="animate-spin w-14 h-14 border-4 border-lime-600 rounded-full border-t-transparent"></span>
    </div>
{:then result} 
    {#if result.items}
        <ul>
        {#each result.items as item (item.id)}
            <li class="p-2 my-2 flex bg-gray-100 rounded-lg shadow-md">
                {#if item.volumeInfo?.imageLinks?.thumbnail}
                    <button 
                        class="flex-shrink-0 self-center w-[128px] h-[182px]" 
                        title={getLabel(item.volumeInfo?.title)}
                        on:click={() => handleClick(item)}
                    >
                        <img src={item.volumeInfo?.imageLinks?.thumbnail} alt="書影"/>						
                    </button>
                {:else}
                    <button 
                        class="self-center flex justify-center items-center w-[128px] h-[182px] bg-slate-300" 
                        title={getLabel(item.volumeInfo?.title)}
                        on:click={() => handleClick(item)} 
                    >
                        <span>No Image</span>
                    </button>
                {/if}
                <div class="p-2 flex flex-col">
                    <button class="self-start" on:click={() => handleClick(item)} title={getLabel(item.volumeInfo?.title)}>
                        <span class="font-bold text-lime-700">{getLabel(item.volumeInfo?.title)}</span>
                    </button>
                    <div class="p-2 flex flex-col">
                        <span>著者：{getLabel(item.volumeInfo?.authors?.join(', '))}</span>
                        <span>ページ数：{getLabel(item.volumeInfo?.pageCount)}</span>
                        <span>発売日：{getLabel(item.volumeInfo?.publishedDate)}</span>
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


<style>
	.collapseDescription {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
</style>

