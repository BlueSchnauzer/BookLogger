<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import BookInfoGrid from '$lib/components/content/parts/BookInfoGrid.svelte';
	import DetailModal from '$lib/components/common/DetailModal.svelte';

	export let bookInfos: BookInfo[];
	let isDisplayDetail = false;
	let currentBookInfo: BookInfo;

	const displayModal = (item: BookInfo) => {
		currentBookInfo = item;
		isDisplayDetail = true;
	}
</script>

<BookInfoGrid {bookInfos} on:click={event => displayModal(event.detail)} />
{#if isDisplayDetail}
	<DetailModal bookInfo={currentBookInfo} bind:isDisplay={isDisplayDetail}/>
{/if}