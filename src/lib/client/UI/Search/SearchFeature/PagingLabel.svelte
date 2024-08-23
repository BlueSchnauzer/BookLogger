<script lang="ts">
	import FormLabel from '$lib/client/UI/Search/SearchFeature/FormLabel.svelte';
	import type { SearchProps } from '$lib/client/UI/Search/SearchFeature/Interface';

	export let searchProps: SearchProps;
	export let isLoading = false;
	export let pageCount: number;
	export let startIndex: number;
	export let resultCount: number;
	export let isBottom = false;

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

{#if searchProps.searchType !== 'none' && (!isBottom || !isLoading)}
	<div class="flex max-w-xl">
		<FormLabel {isLoading} {...searchProps} direction={'backward'} onSubmit={pagingBackward} />
		<span class="m-auto px-2">
			{`${resultCount ? startIndex + 1 : 0}～${startIndex + 10 >= resultCount ? resultCount : startIndex + 10}/${resultCount}`}件
		</span>
		<FormLabel {isLoading} {...searchProps} direction={'forward'} onSubmit={pagingForward} />
	</div>
{/if}
