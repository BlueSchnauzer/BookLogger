<script lang="ts">
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import BookInfoGrid from '../parts/BookInfoGrid.svelte';
	import BookInfoDetail from './BookInfoDetail.svelte';

	export let bookInfos: BookInfo[];
	let isDisplayDetail = false;
	let currentBookInfo: BookInfo;

</script>

<BookInfoGrid {bookInfos} on:click={() => {}} />
{#if isDisplayDetail}
	<BookInfoDetail item={currentBookInfo} bind:isDisplay={isDisplayDetail}/>
{/if}

<style>
	.collapseTitle {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
</style>
