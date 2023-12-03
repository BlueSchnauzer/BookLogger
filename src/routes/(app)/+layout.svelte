<script lang="ts">
	import type { LayoutData } from '../$types';
	import { navigating } from '$app/stores';
	import SideMenuItem from '$lib/components/menu/SideMenu.svelte';
	import BottomMenuItem from '$lib/components/menu/BottomMenu.svelte';

	//export let data: LayoutData;

</script>

<div class="flex w-screen h-screen overflow-hidden">
	<SideMenuItem/>
	{#if $navigating}
		<div class="flex flex-1 justify-center items-center">
			<span class="animate-spin w-14 h-14 border-4 border-lime-600 rounded-full border-t-transparent" />
		</div>
	{:else if !$navigating}
		<slot/>
	{/if}
	<BottomMenuItem/>
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>