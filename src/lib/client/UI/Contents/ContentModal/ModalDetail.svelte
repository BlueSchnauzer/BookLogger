<script lang="ts">
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
	import DetailEdit from '$lib/client/UI/Contents/ContentModal/DetailEdit.svelte';
	import DetailInfo from '$lib/client/UI/Contents/ContentModal/DetailInfo.svelte';

	export let item: BookInfoResponseItem;
</script>

<div class="relative flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
	<DetailInfo {item} />
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
	<DetailEdit {item} />
</div>

<style>
	.customScroll::-webkit-scrollbar {
		width: 8px;
	}
	.customScroll::-webkit-scrollbar-thumb {
		background-color: gray;
		border-radius: 20px;
	}
</style>
