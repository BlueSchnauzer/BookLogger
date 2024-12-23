<script lang="ts">
	import { page } from '$app/stores';
	import { booksMenuItems } from '$lib/client/Shared/Constants/MenuItems';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';

	//ページ移動の度に対応したページにスタイルを当てる
	$: currentUrl = $page.url.pathname;
</script>

<ul class="flex justify-evenly">
	{#each booksMenuItems as item}
		<li
			class="flex-1 text-center h-11 whitespace-nowrap duration-75 hover:text-lime-700 hover:border-lime-700
			{currentUrl === item.ref
				? 'text-lime-700 font-bold border-b-4 border-lime-700'
				: 'border-b border-stone-500'}"
		>
			<a href={item.ref} class="leading-10">
				<p>{item.name}</p>
			</a>
		</li>
	{/each}
</ul>
