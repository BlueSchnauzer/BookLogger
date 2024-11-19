<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { colorLime800 } from '$lib/client/Shared/Constants/DisplayValues';
	import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
	import Icon from '@iconify/svelte';

	export let currentPageCount: number;
	export let lastPageCount: number;

	let pathname = '';
	$: isDisabledBackward = currentPageCount === 0;
	$: isDisabledForward = currentPageCount === lastPageCount;

	const createNavigation = (pageCount: number) =>
		goto(createUrlWithParams(pathname, { page: pageCount.toString() }));

	const gotoFirst = () => createNavigation(0);
	const gotoBackward = () => createNavigation(currentPageCount - 1);
	const gotoForward = () => createNavigation(currentPageCount + 1);
	const gotoLast = () => createNavigation(lastPageCount);

	afterNavigate(({ to }) => to && (pathname = to.url.pathname));
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
		<p>{currentPageCount + 1}</p>
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
