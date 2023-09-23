<script lang="ts">
    import type { PageData } from './$types';
    import type { filterToggleItem } from '$lib/customTypes';
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
    let filterToggleItems: filterToggleItem[] = [
        {id: 1, text: 'お気に入り', isChecked: false},
        {id: 2, text: '読みたい', isChecked: false},
        {id: 3, text: '読んでいる', isChecked: false},
        {id: 4, text: '読み終わった', isChecked: false}
    ]
    const removeAllToggleCheck = () : void => {
        filterToggleItems.forEach(item => item.isChecked = false);
        filterToggleItems = [...filterToggleItems];
    }

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
        <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300">
            <Icon icon="ph:plus" width="36" height="36" color={colorStone700}/>
        </button>
    </div>
    <div id="labelContainer" class="pb-2">
        <div class="flex items-center">
            {#if filterToggleItems.some(item => item.isChecked)}
                <button on:click={removeAllToggleCheck}>
                    <Icon icon="ph:x" width="24" height="24" />
                </button>                
            {/if}
            <ul class="flex items-center">
                {#each filterToggleItems as item (item.id)}
                    <li>
                        <ToggleSwitch id={item.id} text={item.text} bind:isChecked={item.isChecked}/>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
    <!-- <div>
        {#each filterToggleItems as item (item.id)}
            <span>
                {item.isChecked? `checked ${item.text}` : 'unchecked'}
            </span>
        {/each}
    </div> -->
</div>