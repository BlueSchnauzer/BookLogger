<script lang="ts">
	import type { BookInfoResponseItem } from '$lib/client/Application/Interface';
	import { registeredBookInfoUseCases } from '$lib/client/Application/UseCases/BookInfo';
	import {
		dispatchDeletionBookInfoRequest,
		dispatchUpdateBookInfoRequest,
		type bookInfoDeleteEvent,
		type bookInfoUpdateEvent
	} from '$lib/client/Helpers/CustomEvent/Dispatcher';
	import { colorStone700 } from '$lib/client/UI/Shared/StaticValues';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
	import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
	import Icon from '@iconify/svelte';
	import _ from 'lodash';
	import { createEventDispatcher } from 'svelte';

	export let isDisplay = false;
	export let item: BookInfoResponseItem;

	const copiedItem = _.cloneDeep(item);
	let dialog: HTMLDialogElement;
	let isDisplayLoader = false;
	const beforeStatus = copiedItem.entity.status.value;
	const usecases = registeredBookInfoUseCases(fetch);

	/**モーダル表示を表示する*/
	$: if (dialog && isDisplay) {
		dialog.showModal();
	}

	/**モーダルとローダーを閉じる*/
	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
		dialog.close();
	};

	/**Escキーでモーダルを閉じた際に、変数を併せて変更する*/
	const cancelModal = () => {
		isDisplay = false;
	};

	/**ローディングを表示する*/
	const displayLoader = () => {
		isDisplayLoader = true;
	};

	const dispatchUpdate = createEventDispatcher<bookInfoUpdateEvent>();
	const handleUpdateRequest = async () => {
		displayLoader();
		const { isSuccess, message } = await usecases.update(item.entity, beforeStatus);
		closeModalAndLoader();

		dispatchUpdateBookInfoRequest(dispatchUpdate, isSuccess, message, item.entity);
	};

	const dispatchDeletion = createEventDispatcher<bookInfoDeleteEvent>();
	const handleDeleteRequest = async () => {
		if (!confirm('削除します。よろしいですか？')) {
			return;
		}
		displayLoader();
		const { isSuccess, message } = await usecases.remove(item.entity.id!);
		closeModalAndLoader();

		dispatchDeletionBookInfoRequest(dispatchDeletion, isSuccess, message, item.entity.id!);
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
			<RegisteredContent item={copiedItem} />
			<span class="bg-stone-400 h-[1px]" />
			<div class="flex justify-between items-center">
				<SecondaryButton type="button" text="削除" usage="delete" on:click={handleDeleteRequest} />
				<div class="h-14 flex flex-row justify-end items-center">
					<PrimalyButton type="button" text="編集" on:click={handleUpdateRequest} />
					<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
				</div>
			</div>
		</div>
	{/if}
</dialog>
