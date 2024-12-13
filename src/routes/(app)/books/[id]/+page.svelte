<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import ContentDetail from '$lib/client/Feature/Contents/Components/ContentDetail/ContentDetail.svelte';
	import SecondaryButton from '$lib/client/Shared/Components/SecondaryButton.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import { updateBookInfo } from '$lib/client/Feature/Contents/DataManage/updater';
	import { bookInfoStore } from '$lib/client/Feature/Contents/store';
	import { pushErrorToast, pushSuccessToast } from '$lib/client/Shared/Helpers/Toast';
	import FullCoverLoader from '$lib/client/Shared/Components/FullCoverLoader.svelte';
	import { deleteBookInfo } from '$lib/client/Feature/Contents/DataManage/deleter';
	import { afterNavigate, goto } from '$app/navigation';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';

	export let data: PageData;
	const store = bookInfoStore(data.bookInfo);
	$: storedValue = $store;
	const currentStatus = $store.status.value;

	let isDisplay = false;
	let previousPage = '';
	let search = '';

	const handleHistoryBack = () =>
		previousPage ? goto(`${previousPage}${search}`) : goto(BooksURLs.books);

	const handleEditClick = async () => {
		isDisplay = true;
		const { isSuccess, message } = await updateBookInfo(fetch, storedValue, currentStatus);
		isSuccess ? pushSuccessToast(message) : pushErrorToast(message);
		isDisplay = false;
	};

	const handleDeleteClick = async () => {
		if (!window.confirm('削除してよろしいですか？')) {
			return;
		}

		isDisplay = true;
		const { isSuccess, message } = await deleteBookInfo(fetch, data.bookInfo.id!);
		if (isSuccess) {
			pushSuccessToast(message);
			goto(BooksURLs.books);
		} else {
			pushErrorToast(message);
		}
	};

	afterNavigate(({ from }) => {
		if (from) {
			previousPage = from.url.pathname;
			search = from.url.search;
		}
	});
</script>

<div
	class="flex flex-col h-full w-full max-w-[1000px] max-md:pb-16 m-auto px-3 border-x border-stone-400"
>
	<div class="h-14 flex flex-row justify-start items-center">
		<button
			type="button"
			class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
			data-testid="btnClose"
			on:click={handleHistoryBack}
		>
			<Icon icon="ph:caret-left" width="36" height="36" color={colorStone700} />
		</button>
	</div>
	<span class="bg-stone-400 h-[1px]" />
	<ContentDetail {store} {storedValue} />
	<span class="bg-stone-400 h-[1px]" />
	<div class="flex justify-between items-center h-14">
		<SecondaryButton on:click={handleDeleteClick} type="button" text="削除" usage="delete" />
		<PrimaryButton on:click={handleEditClick} type="button" text="編集" />
	</div>
</div>
<FullCoverLoader {isDisplay} />
