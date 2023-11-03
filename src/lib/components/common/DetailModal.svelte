<script lang="ts">
	import Icon from '@iconify/svelte';
	import LayerZindex30 from '$lib/components/common/parts/LayerZindex30.svelte';
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
	import type { books_v1 } from 'googleapis';
	import { createEventDispatcher } from "svelte";
	import DetailContent from '$lib/components/search/parts/DetailContent.svelte';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import RegisteredContent from '$lib/components/content/parts/RegisteredContent.svelte';
	import type { ObjectId } from 'mongodb';

	export let isDisplay = false;
	export let item: books_v1.Schema$Volume = {};
	export let bookInfo: BookInfo = {} as BookInfo;
	let isDisplayLoader = false;
	const colorStone700 = '#44403C';

	/**GoogleBooksAPIから取得したデータか判定*/
	const isVolumeItem = () => 'volumeInfo' in item;
	let isSearching = isVolumeItem();

	/**登録済み書誌データか判定*/
	const isBookInfo = () => '_id' in bookInfo;

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
	const handlePost = (isSuccess: boolean, message: string, deletedId?: ObjectId) => {
		if (isSuccess){
			dispatch('success', {message, deletedId});
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
			headers: {'Content-type': 'application:json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行
		handlePost(response.ok, response.ok ? '登録しました' : '登録に失敗しました。\<br\>時間をおいて再度登録してください。');
	}

	/**書誌データの更新処理をリクエストし、結果に応じたイベントを発行する(呼び出し元でアラート表示などに利用)*/
	const putBookInfo = async () => {
		displayLoader();

		//bookinfoをput
		const response = await fetch('/api/bookinfo', {
			method: 'PUT',
			body: JSON.stringify(bookInfo),
			headers: {'Content-type': 'application:json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行
		handlePost(response.ok, response.ok ? '更新しました' : '更新に失敗しました。\<br\>時間をおいて再度登録してください。');
	};

	/**書誌データの削除をリクエストし、結果に応じたイベントを発行する(呼び出し元でアラート表示などに利用)*/
	const deleteBookInfo = async () => {
		if (!confirm('削除します。よろしいですか？')) { return; }
		displayLoader();

		//削除対象の_idを渡す
		const response = await fetch('/api/bookinfo', {
			method: 'DELETE',
			body: JSON.stringify(bookInfo._id),
			headers: {'Content-type': 'application:json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行し、一覧画面からも削除するために削除したIdを含める
		handlePost(response.ok, response.ok ? '削除しました' : '削除に失敗しました。\<br\>時間をおいて再度登録してください。', bookInfo._id);
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
				<span class="text-xl">{isSearching ? '書籍登録' : '詳細'}</span>
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
			{#if isSearching }
				<DetailContent {item}/>
				<span class="bg-stone-400 h-[1px]" />
				<div class="h-14 flex flex-row justify-end items-center">
					<PrimalyButton type="button" text="登録" on:click={postBookInfo}/>
					<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
				</div>
			{:else if isBookInfo() }
				<RegisteredContent {bookInfo}/>
				<span class="bg-stone-400 h-[1px]" />
				<div class="flex justify-between items-center">
					<SecondaryButton type="button" text="削除" usage="delete" on:click={deleteBookInfo}/>
					<div class="h-14 flex flex-row justify-end items-center">
						<PrimalyButton type="button" text="編集" on:click={putBookInfo}/>
						<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
					</div>
				</div>
			{/if}
		</div>
	{/if}
</LayerZindex30>