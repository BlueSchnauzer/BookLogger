<script lang="ts">
	import type { books_v1 } from 'googleapis';
    
    export let runPromise: () => Promise<books_v1.Schema$Volumes>;

</script>

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


<style>
	.collapseDescription {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
</style>

