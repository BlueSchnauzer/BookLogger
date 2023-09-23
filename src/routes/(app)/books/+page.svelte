<script lang="ts">
    import type { PageData } from './$types';
    import Icon from '@iconify/svelte';
    import SimpleBar from 'simplebar';
    import 'simplebar/dist/simplebar.css';
    //iOS Safariなど用に追加
    import ResizeObserver from 'resize-observer-polyfill';
	import { onMount } from 'svelte';
    import BookCase from '$lib/icons/BookCase.svelte';
	import ToggleSwitch from '$lib/parts/ToggleSwitch.svelte';
    
    //export let data: PageData;

    const colorStone700 = '#44403C';
    const labelList = [
        {id: 1, text: 'お気に入り', checked: false},
        {id: 2, text: '読みたい', checked: false},
        {id: 3, text: '読んでいる', checked: false},
        {id: 4, text: '読み終わった', checked: false}
    ]

    onMount(() => {
        //SSR時のエラー回避のためDOM生成後に実行
        window.ResizeObserver = ResizeObserver;
        const labelContainer = window.document.querySelector<HTMLElement>('#labelContainer');
        if (labelContainer) { new SimpleBar(labelContainer); }
    });

</script>

<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
    <div class="flex items-center justify-between">
        <div class="flex">
            <BookCase width={30} height={30} />
            <h1 class="text-xl pl-2">登録した本</h1>
        </div>
        <div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300">
            <Icon icon="ph:plus" width="36" height="36" color={colorStone700}/>
        </div>
    </div>
    <div id="labelContainer" class="px-2 pb-2">
        <ul class="flex">
            {#each labelList as label (label.id)}
                <li>
                    <ToggleSwitch id={label.id} text={label.text} bind:isChecked={label.checked}/>
                </li>
            {/each}
        </ul>
    </div>
</div>