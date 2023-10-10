<script lang="ts">
	export let isDisplay = false;
	export let isHiddenByOnclick = false;
	export let isUseBackGroundColor = false;

	const changeDisplay = () => {
		if (isHiddenByOnclick) {
			isDisplay = !isDisplay;
		}
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="z-10 absolute top-0 left-0 w-full h-full opacity-30
    {isDisplay ? '' : 'hidden'} {isUseBackGroundColor ? 'bg-black' : ''}"
	on:click={changeDisplay}
/>
