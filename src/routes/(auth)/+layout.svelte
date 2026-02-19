<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class="bg-slate-500 flex justify-center items-center w-screen h-screen bg-gradient-to-bl from-vellum to-lime-300"
>
	{@render children()}
</div>
