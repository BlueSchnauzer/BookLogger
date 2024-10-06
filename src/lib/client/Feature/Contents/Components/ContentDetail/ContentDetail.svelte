<script lang="ts">
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { getTitleLabel } from '$lib/client/Feature/Contents/DataView/dataView';
	import DetailEdit from '$lib/client/Feature/Contents/Components/ContentDetail/DetailEdit.svelte';
	import DetailInfo from '$lib/client/Feature/Contents/Components/ContentDetail/DetailInfo.svelte';

	export let bookInfo: BookInfo;
</script>

<div class="flex-1 flex max-sm:flex-col max-sm:overflow-auto detail-height customScroll">
	<DetailInfo
		thumbnail={bookInfo.thumbnail}
		titleLabel={getTitleLabel(bookInfo.title)}
		bind:isFavorite={bookInfo.isFavorite}
	/>
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
	<DetailEdit {bookInfo} />
</div>

<style>
	.detail-height {
		height: calc(100% - 7rem);
	}
	.customScroll::-webkit-scrollbar {
		width: 8px;
	}
	.customScroll::-webkit-scrollbar-thumb {
		background-color: gray;
		border-radius: 20px;
	}
</style>
