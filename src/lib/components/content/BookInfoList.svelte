<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import BookInfoGrid from '$lib/components/content/parts/BookInfoGrid.svelte';
	import BookInfoDetail from '$lib/components/common/BookInfoDetail.svelte';

	export let bookInfos: BookInfo[];
	let isDisplayDetail = false;
	let currentBookInfo: BookInfo;

</script>

<BookInfoGrid {bookInfos} on:click={() => {}} />
{#if isDisplayDetail}
	<BookInfoDetail item={currentBookInfo} bind:isDisplay={isDisplayDetail}/>
{/if}