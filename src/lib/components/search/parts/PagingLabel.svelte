<script lang="ts">
	import type { searchConditions, SearchType } from '$lib/client/Utils/types';
	import Icon from '@iconify/svelte';

	export let isLoading = false;
	export let searchType: SearchType;
	export let searchConditions: searchConditions;
	export let pageCount: number;
	export let startIndex: number;
	export let resultCount: number;
	export let isBottom = false;

	let query: string | null;
	let bookTitle: string | null;
	let author: string | null;
	let isbn: string | null;

	$: ({ query, bookTitle, author, isbn } = searchConditions);

	const colorLime800 = '#3F6212';

	/**前のページへ再リクエスト*/
	const pagingBackward = (e: SubmitEvent) => {
		if (pageCount! <= 0) {
			e.preventDefault();
			return;
		}
		pageCount! -= 1;
	};

	/**次のページへ再リクエスト*/
	const pagingForward = (e: SubmitEvent) => {
		if (startIndex + 10 >= resultCount) {
			e.preventDefault();
			return;
		}
		pageCount! += 1;
	};
</script>

{#if searchType !== 'none' && (!isBottom || !isLoading)}
	<div class="flex max-w-xl">
		<form action="/books/search" class="flex justify-center" on:submit={(e) => pagingBackward(e)}>
			<button class="hover:bg-stone-300 rounded" type="submit" title="前へ" disabled={isLoading}>
				<Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
			</button>
			{#if searchType === 'fuzzy'}
				<input type="hidden" value={query} name="query" />
			{:else if searchType === 'detail'}
				<input type="hidden" value={bookTitle} name="booktitle" />
				<input type="hidden" value={author} name="author" />
				<input type="hidden" value={isbn} name="isbn" />
			{/if}
			<input type="hidden" bind:value={pageCount} name="page" />
		</form>
		<span class="m-auto px-2">
			{`${resultCount ? startIndex + 1 : 0}～${startIndex + 10 >= resultCount ? resultCount : startIndex + 10}/${resultCount}`}件
		</span>
		<form action="/books/search" class="flex justify-center" on:submit={(e) => pagingForward(e)}>
			<button class="hover:bg-stone-300 rounded" type="submit" title="次へ" disabled={isLoading}>
				<Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
			</button>
			{#if searchType === 'fuzzy'}
				<input type="hidden" value={query} name="query" />
			{:else if searchType === 'detail'}
				<input type="hidden" value={bookTitle} name="booktitle" />
				<input type="hidden" value={author} name="author" />
				<input type="hidden" value={isbn} name="isbn" />
			{/if}
			<input type="hidden" bind:value={pageCount} name="page" />
		</form>
	</div>
{/if}
