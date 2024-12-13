<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ContentsGrid from '$lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import ContentFilters from '$lib/client/Shared/Components/Headers/ContentFilters.svelte';
	import { colorStone700, emptyMessages } from '$lib/client/Shared/Constants/DisplayValues';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';
	import {
		setBooksUrlInfoContext,
		setPathNameContext
	} from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import MagnifingGlass from '$lib/client/Shared/Icons/MagnifingGlass.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount, type ComponentType } from 'svelte';

	export let pageCount: number;
	export let query: string;
	export let order: string;
	export let bookInfos: BookInfo[] | undefined;
	export let lastPageCount: number;
	/**ライブラリ画面(/booksルート)用にレンダリングするか */
	//export let isBooksRoute = false;
	/**データ0件の時に表示するメッセージ */
	export let emptyMessage = emptyMessages.default;

	let inputValue: string;
	let selectValue: number;

	setPathNameContext($page.url.pathname);
	setBooksUrlInfoContext({
		pathName: $page.url.pathname,
		params: {
			page_count: String(pageCount),
			query,
			order
		}
	});

	const handleInputChange = () => {
		// const params = new URLSearchParams({ page: '', query: queryValue });
		// statusParam && params.set('status', statusParam);
		// orderParam && params.set('order', orderParam);
		// goto(createUrlWithParams(pathname, params));
	};

	onMount(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
		<div class="relative">
			<MagnifingGlass
				style={'absolute top-3 left-2'}
				height={16}
				width={16}
				color={colorStone700}
			/>
			<input
				type="text"
				placeholder="Search Books"
				bind:value={query}
				on:change={handleInputChange}
				class="h-10 w-60 max-md:w-full pl-8 py-1 pr-2 rounded border border-stone-400"
			/>
		</div>
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
