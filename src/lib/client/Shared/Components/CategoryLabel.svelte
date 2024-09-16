<script lang="ts">
	export let categoryText: string;
	export let displayText: string | undefined;
</script>

<div class="mb-2 flex flex-col justify-start items-stretch">
	<span class="mb-1 text-lime-800">{categoryText}</span>
	{#if displayText}
		<span class="mb-2 border-b-stone-400 border-b-[1px]">{displayText}</span>
	{:else}
		<span class="mb-2 text-gray-500 border-b-stone-400 border-b-[1px]">データ無し</span>
	{/if}
</div>
