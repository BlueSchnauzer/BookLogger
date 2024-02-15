<script lang="ts">
	import type { menuItemData } from '$lib/customTypes';
	import { page } from '$app/stores';

	const MenuItemDatas: menuItemData[] = [
		{ ref: '/books', name: '全ての本' },
		{ ref: '/books/wish', name: '読みたい'},
		{ ref: '/books/reading', name: '読んでいる'},
		{ ref: '/books/complete', name: '読み終わった'}
	];

	//ページ移動の度に対応したページにスタイルを当てる
	let pathName: string;
	$: pathName = $page.url.pathname;	

</script>

<div class="flex justify-between items-center">
	<ul class="flex items-start -mb-[1px]">
		{#each MenuItemDatas as item }
			<li class="h-11 px-2 whitespace-nowrap 
				{item.ref === '/books' ? 'border-x' : 'border-r'} 
				{item.ref === pathName ? 'bg-vellum text-lime-700 font-medium border-t-[3px] border-t-lime-700' : 'border-b'}
				border-t border-stone-500 bg-stone-300
				hover:bg-vellum duration-150"
			>
				<a href={item.ref} class="leading-10">
					<p>{item.name}</p>
				</a>
			</li>
		{/each}
	</ul>
</div>