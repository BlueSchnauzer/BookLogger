<script lang="ts">
	import { pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	import type { PageData } from './$types';
	import SearchFeature from '$lib/client/Feature/Search/Components/SearchFeature/SearchFeature.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{pageTitles.search}</title>
</svelte:head>

<SearchFeature {...data} />
