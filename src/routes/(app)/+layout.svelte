<script lang="ts">
	import type { Snippet } from 'svelte';
	import SideMenuItem from '$lib/client/Shared/Components/Menus/SideMenu.svelte';
	import BottomMenuItem from '$lib/client/Shared/Components/Menus/BottomMenu.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex w-screen h-screen overflow-hidden">
	<SideMenuItem />
	{@render children()}
	<BottomMenuItem />
</div>

<style lang="postcss">
	:global(body) {
		background-color: theme(colors.vellum);
	}
</style>
