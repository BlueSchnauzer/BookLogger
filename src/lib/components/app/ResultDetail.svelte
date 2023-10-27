<script lang="ts">
	import Icon from '@iconify/svelte';
	import FullCoverZindex30 from '../parts/FullCoverZindex30.svelte';
	import PrimalyButton from '../parts/PrimalyButton.svelte';
	import SecondaryButton from '../parts/SecondaryButton.svelte';
	import type { books_v1 } from 'googleapis';
	import InfoLabel from '../parts/CategoryLabel.svelte';
	import { createEventDispatcher } from "svelte";

	export let isDisplay = false;
	export let item: books_v1.Schema$Volume = {};
	let isDisplayLoader = false;
	const colorStone700 = '#44403C';

	/**モーダルとローダーを閉じる*/
	const closeModalAndLoader = () => {
		isDisplay = false;
		isDisplayLoader = false;
	};

	/**ローディングを表示する*/
	const displayLoader = () => {
		isDisplayLoader = true;
	}

	const getLabel = (data?: string | number): string => {
		return data?.toString() ?? 'データ無し';
	};

	const dispatch = createEventDispatcher();
	const handlePost = (isSuccess: boolean, message: string) => {
		if (isSuccess){
			dispatch('success', message);
		} else {
			dispatch('failed', message);
		}
	};

	/**書誌データの保存処理をリクエストし、結果に応じたイベントを発行する(呼び出し元でアラート表示などに利用)*/
	const postNewBookInfo = async () => {
		displayLoader();

		const response = await fetch('/api/bookinfo', {
			method: 'POST',
			body: JSON.stringify(item),
			headers: {'Content-type': 'application:json'}
		});

		closeModalAndLoader();
		//ユーザ用のメッセージを設定してイベントを発行
		handlePost(response.ok, response.ok ? '登録しました' : '登録に失敗しました。\<br\>時間をおいて再度登録してください。');
	}
</script>

<FullCoverZindex30 bind:isDisplay isUseBackGroundColor={true}>
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
				>
					<Icon icon="ph:x" width="36" height="36" color={colorStone700} />
				</button>
			</div>
			<span class="bg-stone-400 h-[1px]" />
			<div class="flex-1 flex max-sm:flex-col max-h-[486px] max-sm:overflow-auto customScroll">
				<div class="flex flex-col flex-shrink-0 p-4 max-sm:p-0 pt-6 max-sm:pt-4 min-w-44">
					{#if item.volumeInfo?.imageLinks?.thumbnail}
						<img
							class="self-center w-[128px] h-[182px] shadow-md"
							title={getLabel(item.volumeInfo?.title)}
							src={item.volumeInfo?.imageLinks?.thumbnail}
							alt="書影"
						/>
					{:else}
						<div
							class="flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
							title={getLabel(item.volumeInfo?.title)}
						>
							<span>No Image</span>
						</div>
					{/if}
				</div>
				<span class="my-4 bg-stone-400 min-w-[1px] max-sm:hidden" />
				<div class="flex flex-col p-4 max-sm:pt-0 max-h-[486px] max-sm:overflow-unset overflow-auto customScroll">
					{#if item.volumeInfo?.title}
						<span class="pt-2 text-lg font-bold text-lime-700">{item.volumeInfo?.title}</span>
					{:else}
						<span class="pt-2 text-lg font-bold text-gray-400">データ無し</span>
					{/if}
					<div class="p-2">
						<InfoLabel
							categoryText="著者"
							condition={item.volumeInfo?.authors}
							labelFunction={() => item.volumeInfo?.authors?.join(', ')}
						/>
						<InfoLabel
							categoryText="出版社"
							condition={item.volumeInfo?.publisher}
							labelFunction={() => item.volumeInfo?.publisher}
						/>
						<InfoLabel
							categoryText="発売日"
							condition={item.volumeInfo?.publishedDate}
							labelFunction={() => item.volumeInfo?.publishedDate}
						/>
						<InfoLabel
							categoryText="ページ数"
							condition={item.volumeInfo?.pageCount}
							labelFunction={() => item.volumeInfo?.pageCount?.toString()}
						/>
					</div>
					<span class="text-lg font-bold">紹介</span>
					<div class="py-2 px-4">
						{#if item.volumeInfo?.description}
							<p>{item.volumeInfo?.description}</p>
						{:else}
							<p class="text-gray-400">データ無し</p>
						{/if}
					</div>
				</div>
			</div>
			<span class="bg-stone-400 h-[1px]" />
			<div class="h-14 flex flex-row justify-end items-center">
				<PrimalyButton type="button" text="登録" on:click={postNewBookInfo}/>
				<SecondaryButton type="button" text="キャンセル" on:click={closeModalAndLoader} />
			</div>
		</div>
	{/if}
</FullCoverZindex30>

<style>
    @media not all and (min-width: 640px) {
    .max-sm\:overflow-unset {
        overflow: unset;
    }
}
    .customScroll::-webkit-scrollbar {
        width: 8px;
    }
    .customScroll::-webkit-scrollbar-thumb {
        background-color: gray;
        border-radius: 20px;
    }
</style>