<script lang="ts">
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';
	import type { ListItemData } from '$lib/customTypes';

	export let listItemData: ListItemData;
	export let iconColor = '#000000';
</script>

{#if listItemData.icon === BookShelf}
	<div class="mx-3 my-0 bg-stone-200 h-[1px]" />
{/if}

<li class="p-2 duration-300 border-l-4 border-transparent hover:border-x-lime-600 pr-6 hover:bg-stone-600 ">
	<a href={listItemData.ref} class="flex group items-center rounded-md">
		<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
			<svelte:component this={listItemData.icon} color={iconColor} />
		</div>
		{#if listItemData.icon === BookShelf}
			<div class="ml-2.5 flex flex-1 justify-between">
				<span class=" text-stone-200">{listItemData.name}</span>
				<ArrowDown color={iconColor} />
			</div>
		{:else}
			<span class="ml-2.5 text-stone-200">{listItemData.name}</span>
		{/if}
	</a>
</li>
