<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import { getBooksUrlInfoContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
	import MagnifingGlass from '$lib/client/Shared/Icons/MagnifingGlass.svelte';
	import Icon from '@iconify/svelte';

	const urlInfo = getBooksUrlInfoContext();
	const handleInputChange = () => {
		urlInfo.params.page_count = '0';
		goto(createUrlWithParams($page.url.pathname, { ...urlInfo.params }));
	};
</script>

<div class="relative flex">
	<MagnifingGlass style={'absolute top-3 left-2'} height={16} width={16} color={colorStone700} />
	<input
		type="text"
		placeholder="Search Books"
		bind:value={urlInfo.params.query}
		on:change={handleInputChange}
		class="h-10 w-60 max-md:w-full pl-8 py-1 pr-2 rounded border border-stone-400"
	/>
	<div class="pl-2 flex items-center" role="button">
		<Icon class="hover:bg-stone-300 rounded" icon="ph:sort-ascending" width="32" height="32" />
	</div>
</div>
