<script lang="ts">
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { getTitleLabel } from '$lib/client/Feature/Contents/DataView/dataView';
	import DetailEdit from '$lib/client/Feature/Contents/Components/ContentModal/DetailEdit.svelte';
	import DetailInfo from '$lib/client/Feature/Contents/Components/ContentModal/DetailInfo.svelte';

	export let bookInfo: BookInfo;
</script>

<div class="relative flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
	<DetailInfo
		thumbnail={bookInfo.thumbnail}
		titleLabel={getTitleLabel(bookInfo.title)}
		bind:isFavorite={bookInfo.isFavorite}
	/>
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
	<DetailEdit {bookInfo} />
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
