<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	import BookCase from '$lib/client/Shared/Icons/BookCase.svelte';
	//import type { selectFilterItem, toggleFilterItem } from '$lib/customTypes';
	import type { PageData } from './$types';
	import ContentsFeature from '$lib/client/Feature/Contents/Components/ContentsFeature/ContentsFeature.svelte';

	export let data: PageData;
	setPathNameContext($page.url.pathname);

	// const toggleFilterItems: toggleFilterItem[] = [
	// 	{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true }
	// ];
	// const selectFilterItems: selectFilterItem[] = [
	// 	{ id: 1, text: '最近追加した順' },
	// 	{ id: 2, text: '最近読み終わった順' }
	// ];
</script>

<svelte:head>
	<title>{pageTitles.books}</title>
</svelte:head>

<ContentsFeature
	headerIcon={BookCase}
	headerText={pageTitles.books}
	bookInfos={data.bookInfos}
	isBooksRoute={true}
/>
