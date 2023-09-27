<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ComponentType } from 'svelte';

	export let headerIcon: ComponentType;
	export let headerText: string;
	export let isDisplayAddButton: boolean = false;
	const colorStone700 = '#44403C';
</script>

<div class="flex items-center justify-between">
	<div class="flex">
		<svelte:component this={headerIcon} width={30} height={30} />
		<h1 class="text-xl pl-2">{headerText}</h1>
	</div>
	<button
		class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300
        {isDisplayAddButton ? '' : 'invisible'}"
	>
		<Icon icon="ph:plus" width="36" height="36" color={colorStone700} />
	</button>
</div>
