<script lang="ts">
	import { page } from '$app/stores';
	import ContentsFilter from '$lib/client/Feature/Contents/Components/ContentsFilter/ContentsFilter.svelte';
	import ContentsGrid from '$lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import ContentFilters from '$lib/client/Shared/Components/Headers/ContentFilters.svelte';
	import { emptyMessages } from '$lib/client/Shared/Constants/DisplayValues';
	import {
		setBooksUrlInfoContext,
		setPathNameContext
	} from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

	export let pageCount: number;
	export let query: string;
	export let order: string;
	export let bookInfos: BookInfo[] | undefined;
	export let lastPageCount: number;
	/**データ0件の時に表示するメッセージ */
	export let emptyMessage = emptyMessages.default;

	setPathNameContext($page.url.pathname);
	setBooksUrlInfoContext({
		pathName: $page.url.pathname,
		params: {
			page_count: String(pageCount),
			query,
			order
		}
	});

	onMount(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="px-2 pt-1.5 h-24 flex flex-col justify-between">
		<ContentsFilter />
		<ContentFilters />
	</div>
	<div class="mx-2 mb-1 bg-stone-400 h-[1px] xl:block" />
	{#if bookInfos && bookInfos.length}
		<ContentsGrid {bookInfos} {pageCount} {lastPageCount} {emptyMessage} />
	{:else}
		<p class="px-1 font-medium text-lime-700">{@html emptyMessage}</p>
	{/if}
</main>

<style>
	.flexWidth {
		width: calc(100% - (80px));
	}
</style>
