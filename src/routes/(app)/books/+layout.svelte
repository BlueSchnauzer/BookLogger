<script lang="ts">
    import type { LayoutData } from './$types';
    import SimpleBar from 'simplebar';
    import 'simplebar/dist/simplebar.css';
    //iOS Safariなど用に追加
    import ResizeObserver from 'resize-observer-polyfill';
	import { onMount } from 'svelte';
    
    export let data: LayoutData;

    //ISBNで書誌情報を取得し、書影とページ数を取る。
    //→ここじゃなくて、タグの方でawaitロジックを使った方がよさそう

    onMount(() => {
        //SSR時のエラー回避のためDOM生成後に実行
        window.ResizeObserver = ResizeObserver;
        const mainContent = window.document.querySelector<HTMLElement>('#mainContent');
        if (mainContent) { new SimpleBar(mainContent); }
    });

</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
    <slot />
    <div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
    <div id="mainContent" class="p-1 contentHeight">
        <ul class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center">
            {#each data.BookInfos as bookInfo}
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
            {/each}
        </ul>
    </div>
</main>
<div class="max-lg:hidden mx-1 mt-5 mb-3 bg-stone-400 w-[1px]" />

<style>
    .collapseTitle {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
    .flexWidth{
        width: calc(100% - (224px + 208px));
    }
    .contentHeight {
        height: calc(100% - 96px);
    }
</style>