<script lang="ts">
	import type { BookSearchResponseItem } from '$lib/client/Application/Interface';
	import { createBookInfoUseCase } from '$lib/client/Application/UseCases/BookInfo';
	import {
		dispatchSaveBookSearchRequest,
		type bookSearchSaveEvent
	} from '$lib/client/Helpers/Svelte/CustomEvent/Dispatcher';
	import { colorStone700 } from '$lib/client/Static/DisplayValues';
	import ItemDetail from '$lib/client/UI/Search/ItemModal/ItemDetail.svelte';
	import ModalBase from '$lib/client/UI/Shared/Components/ModalBase.svelte';
	import PrimalyButton from '$lib/client/UI/Shared/Components/PrimalyButton.svelte';
	import SecondaryButton from '$lib/client/UI/Shared/Components/SecondaryButton.svelte';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let isDisplay = false;
	export let bookSearch: BookSearchResponseItem;
	let isDisplayLoader = false;

	const usecase = createBookInfoUseCase(fetch);

	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
	};

	const dispatch = createEventDispatcher<bookSearchSaveEvent>();
	const handlePostRequest = async () => {
		isDisplayLoader = true;
		const { isSuccess, message } = await usecase.create(bookSearch.entity);
		closeModalAndLoader();

		dispatchSaveBookSearchRequest(dispatch, isSuccess, message);
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
			<PrimalyButton type="button" text="登録" on:click={handlePostRequest} />
			<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
		</div>
	</div>
</ModalBase>
