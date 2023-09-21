<script lang="ts">
    import type { LayoutData } from './$types';
    
    export let data: LayoutData;

    //ISBNで書誌情報を取得し、書影とページ数を取る。
</script>

<div class="flex-1 my-2 overflow-auto max-md:pb-16">
    <slot />
    <ul class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center">
        {#each data.BookInfos as bookInfo}
            <li class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-xl"
                title="{bookInfo.title}"
            >
                <div class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300">No Image</div>
                <div class="max-sm:hidden">
                    <p class=" px-2 text-sm collapseTitle">{bookInfo.title}</p>
                </div>
                <div class="self-center flex justify-between max-sm:hidden">
                    <span class="pl-2 text-xs">登録日</span>
                    <span class="pr-2 text-sm">2023年9月20日</span>
                </div>
            </li>        
        {/each}
    </ul>
</div>

<style>
    .collapseTitle {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>