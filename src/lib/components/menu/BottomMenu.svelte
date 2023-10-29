<script lang="ts">
    import type { menuItemData } from '$lib/customTypes';
	import type { ComponentType } from 'svelte';

    export let MenuItemDatas: menuItemData[];
	export let currentMenu: ComponentType;
    export let iconColor = '#000000';

</script>

<nav class="hidden max-md:flex w-full fixed bottom-0 h-16 bg-stone-700">
    <ul class="flex flex-1">
        {#each MenuItemDatas as data (data.icon)}
            <li 
                on:touchend={() => currentMenu = data.icon}
                class="flex flex-1 border-b-4 border-transparent
				{data.icon === currentMenu ? 'border-y-lime-600 bg-stone-600' : ''}"
            >
                <a href="{data.ref}" class="flex flex-1 flex-col items-center justify-evenly">
                    <svelte:component this={data.icon} color={iconColor}/>
                    <span class="text-xs text-stone-200">{data.enName}</span>
                </a>
            </li>
        {/each}
    </ul>
</nav>


