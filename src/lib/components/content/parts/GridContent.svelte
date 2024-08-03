<script lang="ts">
	import { page } from '$app/stores';
	import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
	import BottomStatusLabel from '$lib/components/common/parts/BottomStatusLabel.svelte';

	export let view: BookInfoView;
	/**画面サイズが小さくなった際にテキストを非表示にするか*/
	export let isResponsiveText = true;
	const pathName = $page.url.pathname;
</script>

{#if view.thumbnail}
	<img
		class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300"
		src={view.thumbnail}
		alt="test"
	/>
{:else}
	<div
		class="{isResponsiveText
			? 'max-sm:hidden'
			: ''} justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
	>
		<span>No Image</span>
	</div>
	<div
		class="hidden {isResponsiveText
			? 'max-sm:flex'
			: ''} justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
	>
		<span class="p-1 break-all collapseTitle">{view.title}</span>
	</div>
{/if}
<div class={isResponsiveText ? 'max-sm:hidden' : ''}>
	<span class="text-left px-2 text-lime-700 break-all collapseTitle">{view.title}</span>
</div>
<BottomStatusLabel {pathName} {view} {isResponsiveText} />

<style>
	.collapseTitle {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
</style>
