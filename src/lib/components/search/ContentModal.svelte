<script lang="ts">
	import Icon from '@iconify/svelte';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
	import type { books_v1 } from 'googleapis';
	import { createEventDispatcher } from "svelte";
	import DetailContent from '$lib/components/search/parts/DetailContent.svelte';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import type { ObjectId } from 'mongodb';

  export let isDisplay = false;
	export let item: books_v1.Schema$Volume = {};
	let dialog: HTMLDialogElement;
	let isDisplayLoader = false;
	const colorStone700 = '#44403C';

	/**モーダル表示を表示する*/
	$: if (dialog && isDisplay) { dialog.showModal(); }

	/**モーダルとローダーを閉じる*/
	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
		dialog.close();
	};

	/**Escキーでモーダルを閉じた際に、変数を併せて変更する*/
	const cancelModal = () => {
		isDisplay = false;
	}

	/**ローディングを表示する*/
	const displayLoader = () => {
		isDisplayLoader = true;
	}

	const dispatch = createEventDispatcher();
	const handleRequest = (isSuccess: boolean, message: string, updatedItem?: BookInfo, deletedId?: ObjectId) => {
		if (isSuccess){
			dispatch('success', {message, updatedItem, deletedId});
		} else {
			dispatch('failed', message);
		}
	};

	/**書誌データの保存処理をリクエストし、結果に応じたイベントを発行する(呼び出し元でアラート表示などに利用)*/
	const postBookInfo = async () => {
		displayLoader();

		//books_v1.Schema$Volumeをpost
		const response = await fetch('/api/bookinfo', {
			method: 'POST',
			body: JSON.stringify(item),
			headers: {'Content-type': 'application/json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行
		const reseponseMessage = 
			response.ok ? '登録しました' : 
			response.status === 409 ? '登録済みの書籍です' : '登録に失敗しました。\<br\>時間をおいて再度登録してください。';
		handleRequest(response.ok, reseponseMessage);
	}

</script>

<dialog bind:this={dialog} on:cancel={cancelModal}>
	{#if isDisplayLoader}
		<div class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
			<span class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"></span>
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
      <DetailContent {item}/>
      <span class="bg-stone-400 h-[1px]" />
      <div class="h-14 flex flex-row justify-end items-center">
        <PrimalyButton type="button" text="登録" on:click={postBookInfo}/>
        <SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
      </div>
    </div>
	{/if}
</dialog>