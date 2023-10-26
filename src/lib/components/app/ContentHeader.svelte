<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ComponentType } from 'svelte';
	import SearchModal from './SearchModal.svelte';

	export let headerIcon: ComponentType;
	export let headerText: string;
	export let isDisplayAddButton: boolean = false;
	const colorStone700 = '#44403C';

	let isDisplayModal = false;
</script>

<div class="flex items-center justify-between">
	<div class="flex">
		<svelte:component this={headerIcon} width={30} height={30} />
		<h1 class="text-xl pl-2">{headerText}</h1>
	</div>
	<button data-testId="btnDisplaySearch" on:click={() => isDisplayModal = !isDisplayModal}
		class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300
        {isDisplayAddButton ? '' : 'invisible'}"
		title='書籍登録'
	>
		<Icon icon="ph:plus" width="36" height="36" color={colorStone700} />
	</button>
	{#if isDisplayModal}
		<SearchModal bind:isDisplay={isDisplayModal}/>
	{/if}
</div>