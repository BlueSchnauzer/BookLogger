<script lang="ts">
	import { goto } from '$app/navigation';
	import { colorLime800 } from '$lib/client/Shared/Constants/DisplayValues';
	import { getBooksUrlInfoContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
	import Icon from '@iconify/svelte';

	export let pageCount: number;
	export let lastPageCount: number;

	const urlInfo = getBooksUrlInfoContext();
	$: isDisabledBackward = pageCount === 0;
	$: isDisabledForward = pageCount === lastPageCount;

	const createNavigation = (pageCount: number) => {
		urlInfo.params.page_count = String(pageCount);
		goto(createUrlWithParams(urlInfo.pathName, { ...urlInfo.params }));
	};

	const gotoFirst = () => createNavigation(0);
	const gotoBackward = () => createNavigation(pageCount - 1);
	const gotoForward = () => createNavigation(pageCount + 1);
	const gotoLast = () => createNavigation(lastPageCount);
</script>

<div
	class="flex justify-between items-center sticky bottom-2 m-auto mt-4 py-1 px-4 gap-1 size-fit rounded-full bg-gray-100
border border-stone-300 shadow-md"
>
	<button
		class="hover:bg-stone-300 rounded-full"
		disabled={isDisabledBackward}
		on:click={gotoFirst}
	>
		<Icon icon="ph:caret-line-left" width="32" height="32" color={colorLime800} />
	</button>
	<button class="hover:bg-stone-300 rounded" disabled={isDisabledBackward} on:click={gotoBackward}>
		<Icon icon="ph:caret-left" width="32" height="32" color={colorLime800} />
	</button>
	<div class="flex px-4">
		<p>{pageCount + 1}</p>
		<p class="mx-2">/</p>
		<p>{lastPageCount + 1}</p>
	</div>
	<button class="hover:bg-stone-300 rounded" disabled={isDisabledForward} on:click={gotoForward}>
		<Icon icon="ph:caret-right" width="32" height="32" color={colorLime800} />
	</button>
	<button class="hover:bg-stone-300 rounded" disabled={isDisabledForward} on:click={gotoLast}>
		<Icon icon="ph:caret-line-right" width="32" height="32" color={colorLime800} />
	</button>
</div>
