<script lang="ts">
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import ItemDetail from '$lib/client/Feature/Search/Components/ItemModal/ItemDetail.svelte';
	import ModalBase from '$lib/client/Shared/Components/ModalBase.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/client/Shared/Components/SecondaryButton.svelte';
	import Icon from '@iconify/svelte';
	import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
	import { createBookInfo } from '$lib/client/Feature/Search/DataManage/creater';

	export let isDisplay = false;
	export let bookSearch: BookSearch;
	export let onSuccess: (message: string) => void;
	export let onFailed: (message: string) => void;
	let isDisplayLoader = false;

	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
	};

	const handlePostRequest = async () => {
		isDisplayLoader = true;
		const { isSuccess, message } = await createBookInfo(fetch, bookSearch);
		closeModalAndLoader();

		isSuccess ? onSuccess(message) : onFailed(message);
	};
</script>

<ModalBase bind:isDisplay bind:isDisplayLoader>
	<div
		class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[800px] max-h-[600px] m-auto inset-0 px-3 bg-vellum rounded-lg"
	>
		<div class="h-14 flex flex-row justify-between items-center">
			<span class="text-xl">書籍登録</span>
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
		<ItemDetail {bookSearch} />
		<span class="bg-stone-400 h-[1px]" />
		<div class="h-14 flex flex-row justify-end items-center">
			<PrimaryButton type="button" text="登録" on:click={handlePostRequest} />
			<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
		</div>
	</div>
</ModalBase>
