<script lang="ts">
    import type { PageData } from './$types';
    import Icon from '@iconify/svelte';
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
</script>

<div class="pt-1.5 pr-2 h-24 flex flex-col justify-between">
    <div class="flex items-center justify-between">
        <div class="flex">
            <BookCase width={30} height={30} />
            <h1 class="text-xl pl-2">登録した本</h1>
        </div>
        <div class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300">
            <Icon icon="ph:plus" width="32" height="32" color={colorStone700}/>
        </div>
    </div>
    <div class="flex">
        {#each labelList as label (label.id)}
            <ToggleSwitch id={label.id} text={label.text} bind:isChecked={label.checked}/>
        {/each}
    </div>
</div>