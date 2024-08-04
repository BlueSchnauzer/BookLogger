<script lang="ts">
	import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import AsideContent from './AsideContent.svelte';
	import EditableContent from './EditableContent.svelte';

	export let view: BookInfoView;
</script>

<div class="relative flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
	<AsideContent {view} />
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
	<EditableContent {view} />
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
