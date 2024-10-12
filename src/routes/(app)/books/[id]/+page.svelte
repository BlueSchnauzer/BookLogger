<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import ContentDetail from '$lib/client/Feature/Contents/Components/ContentDetail/ContentDetail.svelte';
	import SecondaryButton from '$lib/client/Shared/Components/SecondaryButton.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import { bookInfoStore } from '$lib/client/Feature/Contents/store';

	export let data: PageData;
	const store = bookInfoStore(data.bookInfo);
	const storedValue = $store;
</script>

<div
	class="flex flex-col h-full w-full max-w-[1000px] max-md:pb-16 m-auto px-3 border-x border-stone-400"
>
	<div class="h-14 flex flex-row justify-between items-center">
		<p class="text-xl">詳細</p>
		<button
			type="button"
			class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
			data-testid="btnClose"
		>
			<Icon icon="ph:x" width="36" height="36" color={colorStone700} />
		</button>
	</div>
	<span class="bg-stone-400 h-[1px]" />
	<ContentDetail bookInfo={data.bookInfo} />
	<span class="bg-stone-400 h-[1px]" />
	<div class="flex justify-between items-center h-14">
		<SecondaryButton type="button" text="削除" usage="delete" />
		<div class="h-14 flex flex-row justify-end items-center">
			<PrimaryButton type="button" text="編集" />
			<SecondaryButton type="button" text="キャンセル" />
		</div>
	</div>
</div>
