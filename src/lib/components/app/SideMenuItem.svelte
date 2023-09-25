<script lang="ts">
    import Icon from '@iconify/svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';
	import type { MenuItemData } from '$lib/customTypes';
	import type { ComponentType } from 'svelte';

	export let MenuItemDatas: MenuItemData[];
	export let currentMenu: ComponentType;
	export let iconColor = '#000000';
</script>

<nav class="max-md:hidden m-2 w-56 rounded-xl shadow-2xl bg-stone-700">
	<div class="flex p-3">
		<Icon icon="ph:books-light" width="36" height="36" color={iconColor}/>
		<p class="ml-2.5 text-xl text-stone-200">BookLogger</p>
	</div>
	<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
	<ul>
		{#each MenuItemDatas as data (data.icon)}
			{#if data.icon === BookShelf}
				<li>
					<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
				</li>
			{/if}

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li
				on:click={() => currentMenu = data.icon}
				class="flex h-14 duration-300 border-l-4 border-transparent hover:border-x-lime-600 hover:bg-stone-600 
				{data.icon === currentMenu ? 'border-x-lime-600 bg-stone-600 ' : ''}"
			>
				<a href={data.ref} class="flex flex-1 group items-center rounded-md">
					<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
						<svelte:component this={data.icon} color={iconColor} />
					</div>
					{#if data.icon === BookShelf}
						<div class="ml-2.5 mr-3 flex flex-1 justify-between">
							<span class=" text-stone-200">{data.jpName}</span>
							<Icon icon="ph:arrow-down" width="24" height="24" color={iconColor}/>
						</div>
					{:else}
						<span class="ml-2.5 text-stone-200">{data.jpName}</span>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>
