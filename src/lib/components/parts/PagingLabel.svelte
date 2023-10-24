<script lang="ts">
	import Icon from "@iconify/svelte";
	import { createEventDispatcher } from "svelte";

    export let isLoading = false;
    export let startIndex: number;
    export let resultCount: number;
    export let isBottom = false;
    const colorLime800 = '#3F6212';

    const dispatch = createEventDispatcher();
	const clickBackward = () => {
		dispatch('backward');
	};
    const clickForward = () => {
		dispatch('forward');
    }

</script>

{#if !isBottom || !isLoading}
    <div class="flex max-w-xl">      
        <button class="hover:bg-stone-300 rounded" type="button" on:click={clickBackward} disabled={isLoading}>
            <Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
        </button>   
        <span class="m-auto px-2">{`${resultCount? startIndex + 1 : 0 }～${(startIndex + 10) >= resultCount ? resultCount : (startIndex + 10)}/${resultCount}`}件</span>
        <button class="hover:bg-stone-300 rounded" type="button" on:click={clickForward} disabled={isLoading}>
            <Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
        </button>
    </div>       
{/if} 