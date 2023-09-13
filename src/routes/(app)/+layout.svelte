<script lang="ts">
	import type { LayoutData } from '../$types';

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
    <header class="w-full bg-orange-200">
        <div class="flex justify-between items-center max-w-5xl mx-auto">
            <h1 class="text-4xl font-semibold ml-5">
                モバイルヘッダー
            </h1>
            <button class="mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M4 6l16 0"></path>
                    <path d="M4 12l16 0"></path>
                    <path d="M4 18l16 0"></path>
                 </svg>
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
