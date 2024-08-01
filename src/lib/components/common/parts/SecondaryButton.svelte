<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit';
	export let text = '';
	export let usage: 'cancel' | 'delete' = 'cancel';

	const dispatch = createEventDispatcher();
	const handleClick = () => {
		dispatch('click');
	};
</script>

<button
	{type}
	class="w-24 h-8 border rounded duration-150 bg-gray-50 hover:bg-gray-100
	{usage === 'cancel' ? ' text-lime-700 border-lime-700' : 'text-red-600 border-red-600'}"
	title={text}
	on:click={handleClick}
>
	{text}
</button>
