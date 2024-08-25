<script lang="ts">
	import { colorStone700 } from '$lib/client/Static/DisplayValues';
	import Icon from '@iconify/svelte';
	import ModalBase from '$lib/client/UI/Shared/Components/ModalBase.svelte';
	import PrimaryButton from '$lib/client/UI/Shared/Components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/client/UI/Shared/Components/SecondaryButton.svelte';
	import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';

	export let isDisplay = false;
	export let item: BookInfoResponseItem;

	let isDisplayLoader = false;

	/**モーダルとローダーを閉じる*/
	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
	};
</script>

<ModalBase bind:isDisplay bind:isDisplayLoader>
	<div
		id="test"
		class="z-40 flex flex-col fixed w-[90%] h-[90%] max-w-[800px] max-h-[600px] m-auto inset-0 px-3 bg-vellum rounded-lg"
	>
		<div class="h-14 flex flex-row justify-between items-center">
			<span class="text-xl">詳細</span>
			<button
				type="button"
				on:click={closeModalAndLoader}
				class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
				data-testid="btnClose"
			>
				<Icon icon="ph:x" width="36" height="36" color={colorStone700} />
			</button>
		</div>
		<span class="bg-stone-400 h-[1px]" />
		<RegisteredContent {item} />
		<span class="bg-stone-400 h-[1px]" />
		<div class="flex justify-between items-center">
			<SecondaryButton type="button" text="削除" usage="delete" />
			<div class="h-14 flex flex-row justify-end items-center">
				<PrimaryButton
					type="button"
					text="編集"
					on:click={() => (isDisplayLoader = !isDisplayLoader)}
				/>
				<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
			</div>
		</div>
	</div>
</ModalBase>
