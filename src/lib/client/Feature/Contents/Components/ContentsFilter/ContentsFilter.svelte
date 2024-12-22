<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import { getBooksUrlInfoContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
	import MagnifingGlass from '$lib/client/Shared/Icons/MagnifingGlass.svelte';
	import Icon from '@iconify/svelte';
	import { type OrderFilters } from '$lib/client/Feature/Contents/interface';
	import { onMount } from 'svelte';

	const orderFilterItems: { icon: string; displayName: string; orderFilter: OrderFilters }[] = [
		{
			icon: 'ph:sort-ascending',
			displayName: '登録日が新しい順',
			orderFilter: 'createDateDesc'
		},
		{
			icon: 'ph:sort-descending',
			displayName: '登録日が古い順',
			orderFilter: 'createDateAsc'
		},
		{
			icon: 'ph:clock-clockwise',
			displayName: '更新日順',
			orderFilter: 'updateDate'
		}
	];

	const urlInfo = getBooksUrlInfoContext();
	let isDisplayOrderMenu = false;
	let listButton: HTMLDivElement;

	const handleInputChange = () => {
		urlInfo.params.page_count = '0';
		goto(createUrlWithParams($page.url.pathname, { ...urlInfo.params }));
	};

	const handleOrderClick = (orderFilter: OrderFilters) => {
		urlInfo.params.page_count = '0';
		urlInfo.params.order = orderFilter;
		goto(createUrlWithParams($page.url.pathname, { ...urlInfo.params }));
	};

	onMount(() => {
		const hiddenOrderMenu = (event: MouseEvent) => {
			if (listButton && !listButton.contains(event.target as Node)) {
				isDisplayOrderMenu = false;
			}
		};
		document.addEventListener('click', hiddenOrderMenu);

		return () => document.removeEventListener('click', hiddenOrderMenu);
	});
</script>

<div class="relative flex">
	<MagnifingGlass style={'absolute top-3 left-2'} height={16} width={16} color={colorStone700} />
	<input
		type="text"
		placeholder="Search Books"
		bind:value={urlInfo.params.query}
		on:change={handleInputChange}
		class="h-10 w-80 max-md:w-full pl-8 py-1 pr-2 rounded border border-stone-400"
	/>
	<div class="relative pl-2 flex items-center">
		<!-- svelte-ignore a11y-interactive-supports-focus -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			role="button"
			bind:this={listButton}
			on:click={() => (isDisplayOrderMenu = !isDisplayOrderMenu)}
		>
			<Icon icon="ph:sort-ascending" class="hover:bg-stone-300 rounded" width="32" height="32" />
		</div>
		{#if isDisplayOrderMenu}
			<ul
				class="absolute bg-vellum border border-stone-400 w-48 py-2 top-11 right-0 shadow-lg rounded-md z-10"
			>
				{#each orderFilterItems as item}
					<!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<li
						role="button"
						class="flex gap-2 py-2 px-4 hover:bg-stone-300 duration-150"
						on:click={() => handleOrderClick(item.orderFilter)}
					>
						<Icon icon={item.icon} width="24" height="24" />
						<span>{item.displayName}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
