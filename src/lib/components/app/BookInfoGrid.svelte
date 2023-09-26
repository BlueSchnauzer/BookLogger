<script lang="ts">
    import type { bookInfo } from '$lib/customTypes';

    export let bookInfos: bookInfo[];
</script>

<ul class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center">
    {#each bookInfos as bookInfo}
        {#if bookInfo.isVisible}
            <li class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
                title="{bookInfo.title}"
            >
                <div class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300">No Image</div>
                <div class="max-sm:hidden">
                    <a href="" class="px-2 text-lime-700 break-all collapseTitle" tabindex="0">{bookInfo.title}</a>
                </div>
                <div class="self-center flex justify-between max-sm:hidden">
                    <span class="pl-2 text-xs">登録日</span>
                    <span class="pr-2 text-sm">2023年9月20日</span>
                </div>
            </li>
        {/if}      
    {/each}
</ul>

<style>
    .collapseTitle {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
</style>