<script lang="ts">
	import type { LayoutData } from '../$types';
	import SideMenuItem from '$lib/components/menu/SideMenu.svelte';
	import BottomMenuItem from '$lib/components/menu/BottomMenu.svelte';

	//export let data: LayoutData;
 
</script>

<div class="flex w-screen h-screen overflow-hidden">
	<SideMenuItem/>
	<slot/>
	<BottomMenuItem/>
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>