<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import BookInfoGrid from '$lib/components/content/parts/BookInfoGrid.svelte';
	import DetailModal from '$lib/components/common/DetailModal.svelte';

	export let bookInfos: BookInfo[];
	let isDisplayDetail = false;
	let currentBookInfo: BookInfo;

</script>

<BookInfoGrid {bookInfos} on:click={() => {}} />
{#if isDisplayDetail}
	<DetailModal item={currentBookInfo} bind:isDisplay={isDisplayDetail}/>
{/if}