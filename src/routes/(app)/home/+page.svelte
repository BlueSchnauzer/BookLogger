<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
  import { Chart } from 'chart.js/auto';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
	import GridContent from '$lib/components/content/parts/GridContent.svelte';
	import RegisteredModal from '$lib/components/content/RegisteredModal.svelte';
	import SearchModal from '$lib/components/search/SearchModal.svelte';
  import Home from '$lib/icons/Home.svelte';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { handleSuccess } from '$lib/utils/bookInfo';
	import { pushErrorToast } from '$lib/utils/toast';

	export let data: PageData;
  let countGraph: HTMLCanvasElement;

  const labels = Array.from(data.pagesWithDate.keys());
  const graphData = Array.from(data.pagesWithDate.values());

  let isDisplayDetail = false;
  let isDisplaySearchModal = false;
  let currentBookInfo: BookInfo;
  const pageName = 'ホーム';
  const target = 'mainToast';

  const displayModal = (item: BookInfo) => {
		currentBookInfo = structuredClone(item);
		isDisplayDetail = true;
	}

  /**トーストを表示し、再度最新の書誌データを取得する。*/
  const handleSuccessAndFetchData = async (event: CustomEvent<any>) => {
    data.recentBook = handleSuccess(data.recentBook, event.detail, target);

    const response = await fetch('/api/bookinfo?recentbook=true', { method: 'GET' });
    if (response.ok) { data.recentBook = await response.json() as BookInfo[]; }
  }

  onMount(() => {
    const chart = new Chart(countGraph, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'ページ数',
          data: graphData,
          backgroundColor: '#65a30d', 
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    //アンマウント時にトーストが表示されていれば削除する。
		return () => toast.pop(0);
  })

</script>

<svelte:head>
  <title>{pageName}</title>
</svelte:head>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
  <div class="pl-2 pr-3 pt-1.5 h-14 flex flex-col justify-between">
		<ContentHeader headerIcon={Home} headerText={pageName} />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
  <div class="flex max-lg:flex-col p-1 homeContentHeight overflow-y-auto customScroll">
    <div data-testid="recentbook" class="flex flex-col items-center h-fit p-6 m-6 rounded-xl border-[1px] border-stone-400 bg-gray-100">
      {#if data.recentBook && data.recentBook.length !== 0}
        <p class="text-xl m-2 text-lime-700 font-medium self-start">最近読んだ本</p>
        <button data-testid="btnRecentbook" class="grid item h-96 w-72 bg-slate-50 rounded shadow-md"
          on:click={() => displayModal(data.recentBook[0])}
        >
          <GridContent bookInfo={data.recentBook[0]} isResponsiveText={false}/>
        </button>
      {:else}
        <div class="text-xl m-2 text-lime-700 font-medium">
          <p>本の登録か、読んだ記録の登録がされていません。</p>
          <p>検索メニューから書籍を検索してください。</p>
        </div>
        <button class="px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700"
          on:click={() => isDisplaySearchModal = !isDisplaySearchModal}
        >
          検索する
        </button>
        <SearchModal bind:isDisplay={isDisplaySearchModal}/>
      {/if}
    </div>
    <div data-testid="pageGraph" class="w-[90%] h-[90%] flex flex-col items-center justify-center max-lg:self-center p-6 m-6 rounded-xl border-[1px] border-stone-400 bg-gray-100">
      <p class="text-xl m-2 text-lime-700 font-medium self-start">1週間に読んだページ数</p>
      <div class="max-sm:w-full max-sm:h-full w-[90%] h-[90%] rounded shadow-md">
        <canvas class="bg-gray-100 m-2 p-2 min-h-[250px]" bind:this={countGraph} id="countGraph"></canvas>
      </div>
    </div>
  </div>
  {#if isDisplayDetail}
    <RegisteredModal
      bookInfo={currentBookInfo}
      bind:isDisplay={isDisplayDetail}
      on:success={(event) => handleSuccessAndFetchData(event)}
      on:failed={(event) => pushErrorToast(event.detail, target)}
    />
  {/if}
  <div class="wrap-bottom">
		<SvelteToast {target}/>
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