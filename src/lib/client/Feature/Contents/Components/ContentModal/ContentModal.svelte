<script lang="ts">
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import ModalDetail from '$lib/client/Feature/Contents/Components/ContentModal/ModalDetail.svelte';
	import ModalBase from '$lib/client/Shared/Components/ModalBase.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/client/Shared/Components/SecondaryButton.svelte';
	import Icon from '@iconify/svelte';
	import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
	import { updateBookInfo } from '$lib/client/Feature/Contents/DataManage/updater';
	import { deleteBookInfo } from '$lib/client/Feature/Contents/DataManage/deleter';
	import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';

	export let isDisplay = false;
	export let bookInfo: BookInfo;

	let isDisplayLoader = false;
	const beforeStatus = bookInfo.status.value;

	/**モーダルとローダーを閉じる*/
	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
	};

	const handleUpdate = async () => {
		isDisplayLoader = true;

		closeModalAndLoader();
	};

	const handleDelete = async () => {
		if (!confirm('削除します。よろしいですか？')) {
			return;
		}
		isDisplayLoader = true;

		closeModalAndLoader();
	};
	// const dispatchUpdate = createEventDispatcher<bookInfoUpdateEvent>();
	// const handleUpdateRequest = async () => {
	// 	isDisplayLoader = true;
	// 	const { isSuccess, message } = await usecases.update(item.entity, beforeStatus);
	// 	closeModalAndLoader();

	// 	dispatchUpdateBookInfoRequest(dispatchUpdate, isSuccess, message, item.entity);
	// };

	// const dispatchDeletion = createEventDispatcher<bookInfoDeleteEvent>();
	// const handleDeleteRequest = async () => {
	// 	if (!confirm('削除します。よろしいですか？')) {
	// 		return;
	// 	}
	// 	isDisplayLoader = true;
	// 	const { isSuccess, message } = await usecases.remove(item.entity.id!);
	// 	closeModalAndLoader();

	// 	dispatchDeletionBookInfoRequest(dispatchDeletion, isSuccess, message, item.entity.id!);
	// };
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
		<ModalDetail {bookInfo} />
		<span class="bg-stone-400 h-[1px]" />
		<div class="flex justify-between items-center">
			<SecondaryButton type="button" text="削除" usage="delete" on:click={handleDelete} />
			<div class="h-14 flex flex-row justify-end items-center">
				<PrimaryButton type="button" text="編集" on:click={handleUpdate} />
				<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
			</div>
		</div>
	</div>
</ModalBase>
