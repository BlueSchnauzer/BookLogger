<script lang="ts">
	import Icon from '@iconify/svelte';

	export let isLoading = false;
	export let bookTitle: string | null;
	export let author: string | null;
	export let isbn: string | null;
	export let page: number;
	export let startIndex: number;
	export let resultCount: number;
	export let isBottom = false;
	const colorLime800 = '#3F6212';

	/**前のページへ再リクエスト*/
	const pagingBackward = (e: SubmitEvent) => {
		if (page! <= 0) {
			e.preventDefault();
			return;
		}
		page! -= 1;
	};

	/**次のページへ再リクエスト*/
	const pagingForward = (e: SubmitEvent) => {
		if (startIndex + 10 >= resultCount) {
			e.preventDefault();
			return;
		}
		page! += 1;
	};

</script>

{#if !isBottom || !isLoading}
	<div class="flex max-w-xl">
		<form action="/books/search" class="flex justify-center" on:submit={e => pagingBackward(e)}>
			<button	class="hover:bg-stone-300 rounded" type="submit" title="前へ" disabled={isLoading}>
				<Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
			</button>	
			<input type="hidden" value={bookTitle} name="booktitle">
			<input type="hidden" value={author} name="author">
			<input type="hidden" value={isbn} name="isbn">
			<input type="hidden" bind:value={page} name="page">
		</form>
		<span class="m-auto px-2">
      {`${resultCount ? startIndex + 1 : 0}～${startIndex + 10 >= resultCount ? resultCount : startIndex + 10}/${resultCount}`}件
    </span>
		<form action="/books/search" class="flex justify-center" on:submit={e => pagingForward(e)}>
			<button	class="hover:bg-stone-300 rounded" type="submit" title="次へ" disabled={isLoading}>
				<Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
			</button>
			<input type="hidden" value={bookTitle} name="booktitle">
			<input type="hidden" value={author} name="author">
			<input type="hidden" value={isbn} name="isbn">
			<input type="hidden" bind:value={page} name="page">
		</form>
	</div>
{/if}
