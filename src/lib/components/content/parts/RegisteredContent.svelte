<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
  import AsideContent from './AsideContent.svelte';
  import EditableContent from './EditableContent.svelte';

	export let bookInfo: BookInfo;

</script>

<div class="relative flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
  <AsideContent {bookInfo} />
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
  <EditableContent {bookInfo} />
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
