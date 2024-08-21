<script lang="ts">
	export let isDisplay = false;

	const changeDisplay = () => (isDisplay = !isDisplay);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	data-testid="layerZ30"
	class="z-30 absolute top-0 left-0 w-full h-full bg-opacity-20 bg-black
    {isDisplay ? '' : 'hidden'}"
	on:click={changeDisplay}
>
	{#if isDisplay}
		<div data-testid="loader" class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
			<span
				class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"
			></span>
		</div>
	{/if}
</div>
