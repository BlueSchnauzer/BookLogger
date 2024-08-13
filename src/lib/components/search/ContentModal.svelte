<script lang="ts">
	import type { BookSearchResponseItem } from '$lib/client/Application/Interface';
	import { createBookInfoUseCase } from '$lib/client/Application/UseCases/BookInfo';
	import {
		dispatchSaveBookSearchRequest,
		type bookSearchSaveEvent
	} from '$lib/client/Helpers/CustomEvent/Dispatcher';
	import { colorStone700 } from '$lib/client/UI/Shared/StaticValues';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
	import DetailContent from '$lib/components/search/parts/DetailContent.svelte';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let isDisplay = false;
	export let bookSearch: BookSearchResponseItem;
	let dialog: HTMLDialogElement;
	let isDisplayLoader = false;

	const usecase = createBookInfoUseCase(fetch);

	$: if (dialog && isDisplay) {
		dialog.showModal();
	}

	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
		dialog.close();
	};

	/**Escキーでモーダルを閉じた際に、変数を併せて変更する*/
	const cancelModal = () => {
		isDisplay = false;
	};

	const displayLoader = () => {
		isDisplayLoader = true;
	};

	const dispatch = createEventDispatcher<bookSearchSaveEvent>();
	const handlePostRequest = async () => {
		displayLoader();
		const { isSuccess, message } = await usecase.create(bookSearch.entity);
		closeModalAndLoader();

		dispatchSaveBookSearchRequest(dispatch, isSuccess, message);
	};
</script>

<dialog bind:this={dialog} on:cancel={cancelModal}>
	{#if isDisplayLoader}
		<div class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
			<span
				class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"
			></span>
		</div>
	{:else}
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
			<DetailContent {bookSearch} />
			<span class="bg-stone-400 h-[1px]" />
			<div class="h-14 flex flex-row justify-end items-center">
				<PrimalyButton type="button" text="登録" on:click={handlePostRequest} />
				<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
			</div>
		</div>
	{/if}
</dialog>
