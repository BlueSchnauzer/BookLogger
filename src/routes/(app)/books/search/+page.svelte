<script lang="ts">
	import { pageTitles } from '$lib/client/Static/DisplayValues';
	import type { PageData } from './$types';
	import SearchFeature from '$lib/client/UI/Search/SearchFeature/SearchFeature.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{pageTitles.search}</title>
</svelte:head>

<SearchFeature {...data} />
