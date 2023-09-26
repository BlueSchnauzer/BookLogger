<script lang="ts">
    import type { LayoutData } from './$types';
    import SimpleBar from 'simplebar';
    import 'simplebar/dist/simplebar.css';
    //iOS Safariなど用に追加
    import ResizeObserver from 'resize-observer-polyfill';
	import { onMount } from 'svelte';
	import BookInfoGrid from '$lib/components/app/BookInfoGrid.svelte';
    
    export let data: LayoutData;
    const displayCompleteBooks = () => {
        data.bookInfos.forEach(item => item.isCompleted ? item.isVisible = true : item.isVisible = false)
        data.bookInfos = [...data.bookInfos];
    }

    //ISBNで書誌情報を取得し、書影とページ数を取る。
    //→ここじゃなくて、タグの方でawaitロジックを使った方がよさそう

    onMount(() => {
        //SSR時のエラー回避のためDOM生成後に実行
        window.ResizeObserver = ResizeObserver;
        const mainContent = window.document.querySelector<HTMLElement>('#mainContent');
        if (mainContent) { new SimpleBar(mainContent); }
        (window as any).displayCompleteBooks = displayCompleteBooks;
    });

</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
    <!-- 各ページでレンダリング -->
    <slot />
    <div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
    <div id="mainContent" class="p-1 contentHeight">
        <BookInfoGrid bind:bookInfos={data.bookInfos}/>
    </div>
</main>
<div class="max-lg:hidden mx-1 mt-5 mb-3 bg-stone-400 w-[1px]" />

<style>
    .flexWidth{
        width: calc(100% - (224px + 208px));
    }
    .contentHeight {
        height: calc(100% - 96px);
    }
</style>