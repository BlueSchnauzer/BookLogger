<script lang="ts">
	import ArrowDown from '$lib/icons/ArrowDown.svelte';
	import Shelf from '$lib/icons/Shelf.svelte';
	import type { ListItemData } from '$lib/customTypes';

	export let listItemData: ListItemData;
</script>

{#if listItemData.icon === Shelf}
	<div class="mx-3 my-0 bg-white h-[1px]" />
{/if}

<li class="p-2">
	<a
		href={listItemData.ref}
		class="p-2.5 flex items-center rounded-md duration-200 hover:bg-teal-800"
	>
		<svelte:component this={listItemData.icon} />
		{#if listItemData.icon === Shelf}
			<div class="ml-2.5 flex flex-1 justify-between">
				<span class=" text-white">{listItemData.name}</span>
				<ArrowDown />
			</div>
		{:else}
			<span class="ml-2.5 text-white">{listItemData.name}</span>
		{/if}
	</a>
</li>
