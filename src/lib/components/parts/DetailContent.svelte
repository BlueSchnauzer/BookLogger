<script lang="ts">
	import type { books_v1 } from "googleapis";
    import CategoryLabel from "./CategoryLabel.svelte";

    export let item: books_v1.Schema$Volume;

    	const getLabel = (data?: string | number): string => {
		return data?.toString() ?? 'データ無し';
	};

</script>

<div class="flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
    <div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
        {#if item.volumeInfo?.imageLinks?.thumbnail}
            <img
                class="self-center w-[128px] h-[182px] shadow-md"
                title={getLabel(item.volumeInfo?.title)}
                src={item.volumeInfo?.imageLinks?.thumbnail}
                alt="書影"
            />
        {:else}
            <div
                class="flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
                title={getLabel(item.volumeInfo?.title)}
            >
                <span>No Image</span>
            </div>
        {/if}
    </div>
    <span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
    <div class="flex flex-col p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll">
        {#if item.volumeInfo?.title}
            <span class="pt-2 text-lg font-bold text-lime-700">{item.volumeInfo?.title}</span>
        {:else}
            <span class="pt-2 text-lg font-bold text-gray-400">データ無し</span>
        {/if}
        <div class="p-2">
            <CategoryLabel
                categoryText="著者"
                condition={item.volumeInfo?.authors}
                labelFunction={() => item.volumeInfo?.authors?.join(', ')}
            />
            <CategoryLabel
                categoryText="出版社"
                condition={item.volumeInfo?.publisher}
                labelFunction={() => item.volumeInfo?.publisher}
            />
            <CategoryLabel
                categoryText="発売日"
                condition={item.volumeInfo?.publishedDate}
                labelFunction={() => item.volumeInfo?.publishedDate}
            />
            <CategoryLabel
                categoryText="ページ数"
                condition={item.volumeInfo?.pageCount}
                labelFunction={() => item.volumeInfo?.pageCount?.toString()}
            />
        </div>
        <span class="text-lg font-bold">紹介</span>
        <div class="py-2 px-4">
            {#if item.volumeInfo?.description}
                <p>{item.volumeInfo?.description}</p>
            {:else}
                <p class="text-gray-400">データ無し</p>
            {/if}
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