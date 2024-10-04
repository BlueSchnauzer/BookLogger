<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import ModalDetail from '$lib/client/Feature/Contents/Components/ContentModal/ModalDetail.svelte';
	import SecondaryButton from '$lib/client/Shared/Components/SecondaryButton.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import { bookInfoInterfaceMock } from '$lib/mock/Data';

	export let data: PageData;
	const bookInfo = data.bookInfo ?? bookInfoInterfaceMock;
</script>

<div class="flex flex-col h-full w-full max-w-[800px] m-auto inset-0 px-3 bg-white">
	<div class="h-14 flex flex-row justify-between items-center">
		<span class="text-xl">詳細</span>
		<button
			type="button"
			class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
			data-testid="btnClose"
		>
			<Icon icon="ph:x" width="36" height="36" color={colorStone700} />
		</button>
	</div>
	<span class="bg-stone-400 h-[1px]" />
	<ModalDetail {bookInfo} />
	<span class="bg-stone-400 h-[1px]" />
	<div class="flex justify-between items-center">
		<SecondaryButton type="button" text="削除" usage="delete" />
		<div class="h-14 flex flex-row justify-end items-center">
			<PrimaryButton type="button" text="編集" />
			<SecondaryButton type="button" text="キャンセル" />
		</div>
	</div>
</div>
