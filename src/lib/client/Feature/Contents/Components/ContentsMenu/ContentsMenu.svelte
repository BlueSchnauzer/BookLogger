<script lang="ts">
	import { page } from '$app/stores';
	import { booksMenuItems } from '$lib/client/Shared/Constants/MenuItems';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';

	//ページ移動の度に対応したページにスタイルを当てる
	$: currentUrl = $page.url.pathname;
</script>

<div class="flex justify-between items-center">
	<ul class="flex items-start -mb-[1px]">
		{#each booksMenuItems as item}
			<li
				class="h-11 px-2 whitespace-nowrap
				{item.ref === BooksURLs.books ? 'border-x' : 'border-r'} 
				{item.ref === currentUrl
					? 'bg-vellum text-lime-700 font-medium border-t-[3px] border-t-lime-700'
					: 'border-b'}
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
