<script lang="ts">
	import type { LayoutData } from '../$types';
	import type { ComponentType } from 'svelte';
    import Hamburger from '$lib/icons/Hamburger.svelte';
    import LeanBooks from '$lib/icons/LeanBooks.svelte';
    import Dashboard from '$lib/icons/Dashboard.svelte';
    import AllBooks from '$lib/icons/AllBooks.svelte';
    import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
    import Openingbook from '$lib/icons/OpeningBook.svelte';
    import CompleteBook from '$lib/icons/CompleteBook.svelte';
    import Shelf from '$lib/icons/Shelf.svelte';
    import ArrowDown from '$lib/icons/ArrowDown.svelte';

	//export let data: LayoutData;

	interface ListItemData {
        icon: ComponentType,
		ref: string,
		name: string
	}

	const listItemDatas: ListItemData[] = [
		{ icon: Dashboard, ref: '/dashboard', name: 'ダッシュボード' },
		{ icon: AllBooks, ref: '/books', name: '登録した本' },
		{ icon: PileOfBooks, ref: '/books/wish', name: '読みたい本' },
		{ icon: Openingbook, ref: '/books/reading', name: '読んでいる本' },
		{ icon: CompleteBook, ref: '/books/complete', name: '読み終わった本' },
		{ icon: Shelf, ref: '/shelfs', name: '本棚' }
	];
</script>

<div class="flex flex-col w-screen h-screen">
    <header class="hidden max-md:block w-full bg-orange-200">
        <div class="flex justify-between items-center max-w-5xl mx-auto">
            <button class="ml-5">
                <LeanBooks/>
            </button>
            <button class="mr-5">
                <Hamburger/>
            </button>    
        </div>
    </header>    
    <div class="flex w-full h-full">
        <nav class=" w-[250px] bg-teal-500 overflow-y-auto">
            <div class="flex p-3">
                <LeanBooks/>
                <p class="ml-2.5 text-xl text-white">BookLogger</p>
            </div>
            <div class="mx-3 my-2 bg-white h-[1px]"></div>
            <ul>
                {#each listItemDatas as data (data.name)}
                    {#if data.icon === Shelf}
                        <div class="mx-3 my-0 bg-white h-[1px]"></div>
                        <li class="p-2">
                            <a href={data.ref} class="p-2.5 flex items-center rounded-md duration-200 hover:bg-teal-800">
                                <svelte:component this={data.icon}/>
                                <div class="ml-2.5 flex flex-1 justify-between">
                                    <span class=" text-white">{data.name}</span>
                                    <ArrowDown/>
                                </div>
                            </a>
                        </li>
                    {:else}
                        <li class="p-2">
                            <a href={data.ref} class="p-2.5 flex items-center rounded-md duration-200 hover:bg-teal-800">
                                <svelte:component this={data.icon}/>
                                <span class="ml-2.5 text-white">{data.name}</span>
                            </a>
                        </li>
                    {/if}
                {/each}
            </ul>
        </nav>
        <div class="flex-1">
            <slot />
        </div>    
    </div>
</div>
