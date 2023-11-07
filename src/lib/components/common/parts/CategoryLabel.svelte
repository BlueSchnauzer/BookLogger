<script lang="ts">
	export let categoryText: string;
	export let condition: any;
	export let labelFunction: () => string | undefined;
	export let isRegistered = false;

	let mainStyle = '';
	let labelStyle = '';

	if (isRegistered) {
		mainStyle = 'mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch';
		labelStyle = 'max-sm:self-end';
	}

</script>

<div class={mainStyle}>
	<span class="font-medium">{categoryText}</span>
	{#if condition}
		<span class={labelStyle}>{labelFunction()}</span>
	{:else}
		<span class="text-gray-500 {labelStyle}">データ無し</span>
	{/if}
</div>
