<script lang="ts">
	import Icon from '@iconify/svelte';
	import LayerZindex30 from '$lib/components/common/parts/LayerZindex30.svelte';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
	import { createEventDispatcher } from "svelte";
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
	import type { ObjectId } from 'mongodb';

	export let isDisplay = false;
	export let bookInfo: BookInfo;
	let isDisplayLoader = false;
	const colorStone700 = '#44403C';
	const currentHistoryLength: number = bookInfo.history != null ? bookInfo.history.length : 0;

	/**モーダルとローダーを閉じる*/
	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
	};

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

	/**読んだ記録が追加されたが、ステータスが読みたい本のままになっているか*/
	const isAddedFirstHistoryToWishBook = () => {
		return bookInfo.status === 'wish' && currentHistoryLength === 0 && bookInfo.history!.length >= 1;
	}

	/**書誌データの更新処理をリクエストし、結果に応じたイベントを発行する(呼び出し元でアラート表示などに利用)*/
	const putBookInfo = async () => {
		let updateMessage = '更新しました。';
		if (isAddedFirstHistoryToWishBook()){
			if (confirm('ステータスを「読んでいる本」に変更しますか？\n(キャンセルの場合、そのままのステータスで保存します)')) {
				bookInfo.status = 'reading'; 
				updateMessage = '読んでいる本に移動しました。';
			}
		}
		
		displayLoader();

		//bookinfoをput
		const response = await fetch('/api/bookinfo', {
			method: 'PUT',
			body: JSON.stringify(bookInfo),
			headers: {'Content-type': 'application/json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行
		handleRequest(response.ok, response.ok ? updateMessage : '更新に失敗しました。\<br\>時間をおいて再度登録してください。', bookInfo);
	};

	/**書誌データの削除をリクエストし、結果に応じたイベントを発行する(呼び出し元でアラート表示などに利用)*/
	const deleteBookInfo = async () => {
		if (!confirm('削除します。よろしいですか？')) { return; }
		displayLoader();

		//削除対象の_idを渡す
		const response = await fetch('/api/bookinfo', {
			method: 'DELETE',
			body: JSON.stringify(bookInfo._id),
			headers: {'Content-type': 'application/json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行し、一覧画面からも削除するために削除したIdを含める
		handleRequest(response.ok, response.ok ? '削除しました' : '削除に失敗しました。\<br\>時間をおいて再度登録してください。', undefined, bookInfo._id);
	}

</script>

<LayerZindex30 bind:isDisplay isUseBackGroundColor={true}>
	{#if isDisplayLoader}
		<div class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
			<span class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"></span>
		</div>
	{:else}
		<div
			class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[800px] max-h-[600px] m-auto inset-0 px-3 bg-vellum rounded-lg"
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
      <RegisteredContent {bookInfo}/>
      <span class="bg-stone-400 h-[1px]" />
      <div class="flex justify-between items-center">
        <SecondaryButton type="button" text="削除" usage="delete" on:click={deleteBookInfo}/>
        <div class="h-14 flex flex-row justify-end items-center">
          <PrimalyButton type="button" text="編集" on:click={putBookInfo}/>
          <SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
        </div>
      </div>
		</div>
	{/if}
</LayerZindex30>