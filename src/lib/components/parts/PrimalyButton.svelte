<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit';
	export let text = '';
    export let isUseMargin = true;

	const dispatch = createEventDispatcher();
	const handleClick = () => {
		dispatch('click');
	};
</script>

<button
	{type}
	class="w-24 h-8 {isUseMargin? 'mr-1' : ''} bg-lime-700 text-gray-50 rounded duration-150 hover:bg-lime-600"
	on:click={handleClick}>
    {text}
</button>