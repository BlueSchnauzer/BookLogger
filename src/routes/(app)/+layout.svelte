<script lang="ts">
	import type { LayoutData } from '../$types';
    import Hamburger from '$lib/icons/Hamburger.svelte';

	//export let data: LayoutData;

	interface listItem {
		ref: string;
		name: string;
	}

	const listItems: listItem[] = [
		{ ref: '/dashboard', name: 'ダッシュボード' },
		{ ref: '/books', name: '登録した本' },
		{ ref: '/books/wish', name: '読みたい本' },
		{ ref: '/books/reading', name: '読んでいる本' },
		{ ref: '/books/complete', name: '読み終わった本' },
		{ ref: '/shelfs', name: '本棚' }
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
        <nav class=" bg-lime-200">
            <div>
                <p>アプリ名</p>
            </div>
            <ul>
                {#each listItems as item}
                    <li>
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
