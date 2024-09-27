<script lang="ts">
	import { page } from '$app/stores';
	import { setPathNameContext } from '$lib/client/Shared/Helpers/Svelte/ContextAPI';
	import { mainToastTarget } from '$lib/client/Shared/Helpers/Toast';
	import { pageTitles } from '$lib/client/Shared/Constants/DisplayValues';
	import Home from '$lib/client/Shared/Icons/Home.svelte';
	import GridItem from '$lib/client/Feature/Contents/Components/ContentsGrid/GridItem.svelte';
	import ContentHeader from '$lib/client/Shared/Components/Headers/ContentHeader.svelte';
	import ConditionModal from '$lib/client/Feature/Search/Components/ConditionModal/ConditionModal.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import _ from 'lodash';
	import ContentModal from '$lib/client/Feature/Contents/Components/ContentModal/ContentModal.svelte';
	import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';

	export let data: PageData;

	setPathNameContext($page.url.pathname);

	let countGraph: HTMLCanvasElement;
	const labels = Array.from(data.historyMap!.keys());
	const graphData = Array.from(data.historyMap!.values());

	let isDisplayDetail = false;
	let isDisplayConditionModal = false;
	let currentItem: BookInfo;

	const displayModal = (item?: BookInfo) => {
		if (!item) {
			return;
		}

		currentItem = _.cloneDeep(item);
		isDisplayDetail = true;
	};

	// const handleUpdateSuccess = (event: CustomEvent<updateBookInfoParameter>) => {
	// 	data.recentBookInfo = handleRecentBookInfoUpdate(currentItem, event.detail);
	// };
	// const handleDeletionSuccess = (event: CustomEvent<deletionBookInfoParameter>) => {
	// 	data.recentBookInfo = handleRecentBookInfoDeletion(currentItem, event.detail);
	// };

	onMount(() => {
		const chart = new Chart(countGraph, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'ページ数',
						data: graphData,
						backgroundColor: '#65a30d',
						borderRadius: 10
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		});

		//アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
	});
</script>

<svelte:head>
	<title>{pageTitles.home}</title>
</svelte:head>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
	<div class="pl-2 pr-3 pt-1.5 h-14 flex flex-col justify-between">
		<ContentHeader headerIcon={Home} headerText={pageTitles.home} />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
	<div class="flex max-lg:flex-col p-1 homeContentHeight overflow-y-auto customScroll">
		<div
			data-testid="recentbook"
			class="flex flex-col items-center h-fit p-6 m-6 rounded-xl border-[1px] border-stone-400 bg-gray-100"
		>
			{#if data.recentBookInfo}
				<p class="text-xl m-2 text-lime-700 font-medium self-start">最近読んだ本</p>
				<button
					data-testid="btnRecentbook"
					class="grid item h-96 w-72 bg-slate-50 rounded shadow-md"
					on:click={() => displayModal(data.recentBookInfo)}
				>
					<GridItem bookInfo={data.recentBookInfo} isResponsiveText={false} />
				</button>
			{:else}
				<div class="text-xl m-2 text-lime-700 font-medium">
					<p>本の登録か、読んだ記録の登録がされていません。</p>
					<p>検索メニューから書籍を登録してください。</p>
				</div>
				<button
					class="px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700"
					on:click={() => (isDisplayConditionModal = !isDisplayConditionModal)}
				>
					検索する
				</button>
				<ConditionModal bind:isDisplay={isDisplayConditionModal} />
			{/if}
		</div>
		<div
			data-testid="pageGraph"
			class="w-[90%] h-[90%] flex flex-col items-center justify-center max-lg:self-center p-6 m-6 rounded-xl border-[1px] border-stone-400 bg-gray-100"
		>
			<p class="text-xl m-2 text-lime-700 font-medium self-start">1週間に読んだページ数</p>
			<div class="max-sm:w-full max-sm:h-full w-[90%] h-[90%] rounded shadow-md">
				<canvas class="bg-gray-100 m-2 p-2 min-h-[250px]" bind:this={countGraph} id="countGraph"
				></canvas>
			</div>
		</div>
	</div>
	{#if isDisplayDetail}
		<ContentModal bind:isDisplay={isDisplayDetail} bookInfo={currentItem} />
	{/if}
	<div class="wrap-bottom">
		<SvelteToast target={mainToastTarget} />
	</div>
</main>

<style>
	.flexWidth {
		width: calc(100% - (224px));
	}
	.homeContentHeight {
		height: calc(100% - 56px);
	}
	.customScroll::-webkit-scrollbar {
		width: 8px;
	}
	.customScroll::-webkit-scrollbar-thumb {
		background-color: gray;
		border-radius: 20px;
	}
	.wrap-bottom {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
