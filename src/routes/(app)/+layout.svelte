<script lang="ts">
	import type { LayoutData } from '../$types';
	import type { ComponentType } from 'svelte';
    import Hamburger from '$lib/icons/Hamburger.svelte';
    import Dashboard from '$lib/icons/Dashboard.svelte';
    import AllBooks from '$lib/icons/AllBooks.svelte';
    import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
    import Openingbook from '$lib/icons/OpeningBook.svelte';
    import CompleteBook from '$lib/icons/CompleteBook.svelte';
    import Shelf from '$lib/icons/Shelf.svelte';

	//export let data: LayoutData;

	interface listItem {
        icon: ComponentType,
		ref: string,
		name: string
	}

	const listItems: listItem[] = [
		{ icon: Dashboard, ref: '/dashboard', name: 'ダッシュボード' },
		{ icon: AllBooks, ref: '/books', name: '登録した本' },
		{ icon: PileOfBooks, ref: '/books/wish', name: '読みたい本' },
		{ icon: Openingbook, ref: '/books/reading', name: '読んでいる本' },
		{ icon: CompleteBook, ref: '/books/complete', name: '読み終わった本' },
		{ icon: Shelf, ref: '/shelfs', name: '本棚' }
	];
</script>

<div class="flex flex-col">
    <header class="hidden max-md:block w-full bg-orange-200">
        <div class="flex justify-between items-center max-w-5xl mx-auto">
            <h1 class="text-4xl font-semibold ml-5">
                モバイルヘッダー
            </h1>
            <button class="mr-5">
                <Hamburger/>
            </button>    
        </div>
    </header>    
    <div class="flex">
        <nav class="fixed w-[250px] bg-teal-200 overflow-y-auto">
            <div>
                <p>アプリ名</p>
            </div>
            <ul>
                {#each listItems as item}
                    <li>
                        <svelte:component this={item.icon}/>
                        <a href={item.ref}>{item.name}</a>
                    </li>
                {/each}
            </ul>
        </nav>
        <div>
            <slot />
        </div>    
    </div>
</div>
