<script lang="ts">
	interface Props {
		type: 'button' | 'submit';
		text: string;
		usage?: 'cancel' | 'delete';
		onclick: () => void;
	}

	let { type, text, usage = 'cancel', onclick }: Props = $props();
</script>

<button
	{type}
	class="w-24 h-8 border rounded duration-150 bg-gray-50 hover:bg-gray-100
	{usage === 'cancel' ? ' text-lime-700 border-lime-700' : 'text-red-600 border-red-600'}"
	title={text}
	{onclick}
>
	{text}
</button>
