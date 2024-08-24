<script lang="ts">
	import type { LayoutData } from '../$types';
	import SideMenuItem from '$lib/client/UI/Shared/Components/Menus/SideMenu.svelte';
	import BottomMenuItem from '$lib/client/UI/Shared/Components/Menus/BottomMenu.svelte';

	//export let data: LayoutData;
</script>

<div class="flex w-screen h-screen overflow-hidden">
	<SideMenuItem />
	<slot />
	<BottomMenuItem />
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>
