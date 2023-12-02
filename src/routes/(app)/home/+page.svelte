<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
  import { Chart } from 'chart.js/auto';

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
  <canvas bind:this={countGraph} id="countGraph"></canvas>
</main>

<style>
  .flexWidth {
		width: calc(100% - (224px));
	}
</style>