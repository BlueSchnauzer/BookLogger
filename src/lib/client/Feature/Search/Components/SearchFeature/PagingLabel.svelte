<script lang="ts">
	import FormLabel from '$lib/client/Feature/Search/Components/SearchFeature/FormLabel.svelte';
	import type { SearchProps } from '$lib/client/Feature/Search/Components/SearchFeature/Interface';
	import { onMount } from 'svelte';

	export let searchProps: SearchProps;
	export let isLoading = false;
	export let resultCount: number;
	export let isBottom = false;

	/**前のページへ再リクエスト*/
	const pagingBackward = (e: SubmitEvent) => {
		if (searchProps.pageCount! <= 0) {
			e.preventDefault();
			return;
		}
		searchProps.pageCount! -= 1;
	};

	/**次のページへ再リクエスト*/
	const pagingForward = (e: SubmitEvent) => {
		if (searchProps.startIndex + 10 >= resultCount) {
			e.preventDefault();
			return;
		}
		searchProps.pageCount! += 1;
	};
</script>

{#if searchProps.searchType !== 'none' && (!isBottom || !isLoading)}
	<div class="flex max-w-xl">
		<FormLabel {isLoading} {...searchProps} direction={'backward'} onSubmit={pagingBackward} />
		<span class="m-auto px-2">
			{`${resultCount ? searchProps.startIndex + 1 : 0}～${
				searchProps.startIndex + 10 >= resultCount ? resultCount : searchProps.startIndex + 10
			}/${resultCount}件`}
		</span>
		<FormLabel {isLoading} {...searchProps} direction={'forward'} onSubmit={pagingForward} />
	</div>
{/if}
