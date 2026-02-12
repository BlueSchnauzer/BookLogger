<script lang="ts">
	interface Props {
		value: string;
		name: string;
		disabled: boolean;
		formError: boolean;
	}

	let { value = $bindable(), name, disabled, formError = $bindable() }: Props = $props();

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
	onkeypress={(e) => preventSubmit(e)}
	{disabled}
/>
