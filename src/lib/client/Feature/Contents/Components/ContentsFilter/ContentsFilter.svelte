<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import { getBooksUrlInfoContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
	import MagnifingGlass from '$lib/client/Shared/Icons/MagnifingGlass.svelte';
	import Icon from '@iconify/svelte';
	import { type OrderFilters } from '$lib/client/Feature/Contents/interface';

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
	let isDisplayOrderMenu = $state(false);
	let listButton: HTMLDivElement;

	const handleInputChange = () => {
		urlInfo.params.page_count = '0';
		goto(createUrlWithParams(page.url.pathname, { ...urlInfo.params }));
	};

	const handleOrderClick = (orderFilter: OrderFilters) => {
		urlInfo.params.page_count = '0';
		urlInfo.params.order = orderFilter;
		goto(createUrlWithParams(page.url.pathname, { ...urlInfo.params }));
	};

	$effect(() => {
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
		onchange={handleInputChange}
		class="h-10 w-80 max-md:w-full pl-8 py-1 pr-2 rounded border border-stone-400"
	/>
	<div class="relative pl-2 flex items-center">
		<!-- svelte-ignore a11y_interactive_supports_focus -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			role="button"
			bind:this={listButton}
			onclick={() => (isDisplayOrderMenu = !isDisplayOrderMenu)}
		>
			<Icon icon="ph:sort-ascending" class="hover:bg-stone-300 rounded" width="32" height="32" />
		</div>
		{#if isDisplayOrderMenu}
			<ul
				class="absolute bg-vellum border border-stone-400 w-56 py-2 top-11 right-0 shadow-lg rounded-md z-10"
			>
				{#each orderFilterItems as item}
					<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<li
						role="button"
						class="flex gap-2 py-2 px-4 hover:bg-stone-300 duration-150"
						onclick={() => handleOrderClick(item.orderFilter)}
					>
						<Icon icon={item.icon} width="24" height="24" />
						<span>{item.displayName}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
