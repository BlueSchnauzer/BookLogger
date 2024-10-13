<script lang="ts">
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { getTitleLabel } from '$lib/client/Feature/Contents/DataView/dataView';
	import DetailEdit from '$lib/client/Feature/Contents/Components/ContentDetail/DetailEdit.svelte';
	import DetailInfo from '$lib/client/Feature/Contents/Components/ContentDetail/DetailInfo.svelte';
	import type { bookInfoStore } from '$lib/client/Feature/Contents/store';

	export let store: ReturnType<typeof bookInfoStore>;
	export let storedValue: BookInfo;
</script>

<div class="flex-1 flex max-sm:flex-col max-sm:overflow-auto detail-height customScroll">
	<DetailInfo
		thumbnail={storedValue.thumbnail}
		titleLabel={getTitleLabel(storedValue.title)}
		bind:isFavorite={storedValue.isFavorite}
	/>
	<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
	<DetailEdit {store} {storedValue} />
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
