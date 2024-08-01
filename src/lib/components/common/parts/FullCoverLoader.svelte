<script lang="ts">
	import LayerZindex30 from '$lib/components/common/parts/LayerZindex30.svelte';

	export let isDisplay = false;
</script>

<LayerZindex30 bind:isDisplay isUseBackGroundColor={true} />
{#if isDisplay}
	<div data-testid="loader" class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
		<span class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"
		></span>
	</div>
{/if}
