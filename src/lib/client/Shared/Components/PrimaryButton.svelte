<script lang="ts">
	interface Props {
		type: 'button' | 'submit';
		text: string;
		isUseMargin?: boolean;
		onclick?: () => void;
	}

	let { type, text, isUseMargin = true, onclick }: Props = $props();
</script>

<button
	{type}
	class="w-24 h-8 {isUseMargin ? 'mr-1' : ''}
	bg-lime-700 text-gray-50 rounded duration-150 hover:bg-lime-600"
	title={text}
	{onclick}
>
	{text}
</button>
