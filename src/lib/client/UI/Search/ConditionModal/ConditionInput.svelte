<script lang="ts">
	export let value: string;
	export let name: string;
	export let disabled: boolean;
	export let formError: boolean;

	/**インプットタグでのEnterを無効化*/
	const preventSubmit = (e: KeyboardEvent) => {
		formError = false;
		if (e.key === 'Enter') {
			e.preventDefault();
		}
	};
</script>

<input
	class="px-2 py-1 rounded-lg border border-stone-300"
	bind:value
	{name}
	aria-label={name}
	type="text"
	size="30"
	on:keypress={(e) => preventSubmit(e)}
	{disabled}
/>
