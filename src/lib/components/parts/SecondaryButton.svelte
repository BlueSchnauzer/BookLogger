<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit';
	export let text = '';

	const dispatch = createEventDispatcher();
	const handleClick = () => {
		dispatch('click');
	};
</script>

<button
	{type}
	class="w-24 h-8 bg-gray-50 text-lime-700 border border-lime-700 rounded duration-150 hover:bg-gray-100"
	title={text}
	on:click={handleClick}>
    {text}
</button>
