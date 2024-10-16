<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import ContentDetail from '$lib/client/Feature/Contents/Components/ContentDetail/ContentDetail.svelte';
	import SecondaryButton from '$lib/client/Shared/Components/SecondaryButton.svelte';
	import PrimaryButton from '$lib/client/Shared/Components/PrimaryButton.svelte';
	import { updateBookInfo } from '$lib/client/Feature/Contents/DataManage/updater';
	import { bookInfoStore } from '$lib/client/Feature/Contents/store';
	import { afterNavigate, goto } from '$app/navigation';
	import { BooksURLs } from '$lib/client/Shared/Constants/urls';

	export let data: PageData;
	const store = bookInfoStore(data.bookInfo);
	$: storedValue = $store;
	let previousPage = '';

	const handleHistoryBack = () => (previousPage ? goto(previousPage) : goto(BooksURLs.books));

	const handleEditClick = async () => {
		//ローダーを出す。タグが無いので入れる。
		const { isSuccess, message } = await updateBookInfo(
			fetch,
			storedValue,
			data.bookInfo.status.value
		);
		isSuccess ? pushToastOnSuccess(message) : pushToastOnFailed(message);
	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
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
		<SecondaryButton type="button" text="削除" usage="delete" />
			<PrimaryButton on:click={handleEditClick} type="button" text="編集" />
	</div>
</div>
