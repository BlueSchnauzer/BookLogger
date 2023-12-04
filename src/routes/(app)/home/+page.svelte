<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
  import { Chart } from 'chart.js/auto';
	import ContentHeader from '$lib/components/header/ContentHeader.svelte';
  import Home from '$lib/icons/Home.svelte';

	export let data: PageData;
  let countGraph: HTMLCanvasElement;

  const labels = Array.from(data.pagesWithDate.keys());
  const graphData = Array.from(data.pagesWithDate.values());

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
      }
    });
  })

</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
  <div class="pl-2 pr-3 pt-1.5 h-14 flex flex-col justify-between">
		<ContentHeader headerIcon={Home} headerText={'ホーム'} isDisplayAddButton={true} />
	</div>
	<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
  <div class="flex max-lg:flex-col p-1 homeContentHeight overflow-y-auto customScroll">
    <div class="flex flex-col items-center h-fit p-6 m-6 rounded-xl border-[1px] border-stone-400 bg-gray-100">
      <p class="text-xl m-2 text-lime-700 font-medium self-start">最近読んだ本</p>
      <button class="h-96 w-72 bg-slate-50 rounded shadow-md">
        <div class="w-[128px] h-[182px]">
          <span>No Image</span>
        </div>
      </button>
    </div>
    <div class="w-[90%] h-fit flex flex-col items-center justify-center max-lg:self-center p-6 m-6 rounded-xl border-[1px] border-stone-400 bg-gray-100">
      <p class="text-xl m-2 text-lime-700 font-medium self-start">1週間に読んだページ数</p>
      <div class="w-[90%] h-[90%]">
        <canvas class="bg-gray-100 m-2 p-2" bind:this={countGraph} id="countGraph"></canvas>
      </div>
    </div>
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
</style>