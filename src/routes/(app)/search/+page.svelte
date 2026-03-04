<script lang="ts">
	import { page } from '$app/state';
	import { pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	import SearchFeature from '$lib/client/Feature/Search/Components/SearchFeature/SearchFeature.svelte';
	import type { SearchProps, SearchType } from '$lib/client/Feature/Search/Components/SearchFeature/Interface';

	const maxResults = 10;

	const query     = $derived(page.url.searchParams.get('query'));
	const bookTitle = $derived(page.url.searchParams.get('booktitle'));
	const author    = $derived(page.url.searchParams.get('author'));
	const isbn      = $derived(page.url.searchParams.get('isbn'));
	const pageCount = $derived(Math.max(0, Number(page.url.searchParams.get('page') ?? 0)));
	const startIndex = $derived(pageCount > 0 ? pageCount * maxResults : 0);

	const searchType: SearchType = $derived(
		query ? 'fuzzy' : (bookTitle || author || isbn) ? 'detail' : 'none'
	);

	const searchProps: SearchProps = $derived({
		searchType,
		searchConditions: { query, bookTitle, author, isbn },
		pageCount,
		startIndex
	});
</script>

<svelte:head>
	<title>{pageTitles.search}</title>
</svelte:head>

<SearchFeature {searchProps} />
