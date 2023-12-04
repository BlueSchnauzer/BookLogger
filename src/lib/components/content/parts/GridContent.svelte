<script lang="ts">
	import { page } from '$app/stores';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { getThumbnailByIsbn } from '$lib/GoogleBooksAPI/RequestManage';
	import BottomStatusLabel from '$lib/components/common/parts/BottomStatusLabel.svelte';
	import { getTypeForBottomLabel } from '$lib/utils/bookInfo';

  export let bookInfo: BookInfo;
  /**画面サイズが小さくなった際にテキストを非表示にするか*/
  export let isResponsiveText = true;

  const typeForLabel = getTypeForBottomLabel($page.url.pathname);

  /**書影を取得する(gapi固有の情報なので保存せず都度取得)*/
	const setThumbnail = async (bookInfo: BookInfo) => {
		//画面の再レンダリング時は取得済みなので実行しない。
		if (!bookInfo.thumbnail) { bookInfo.thumbnail = await getThumbnailByIsbn(bookInfo.identifier?.isbn_13!); }
	};

</script>

<!-- 書影のリクエストを待機 -->
{#await setThumbnail(bookInfo)}
  <div
    class="justify-self-center self-center flex items-center justify-center w-[128px] h-[182px] border border-slate-300"
  >
    <span
      class="animate-spin w-10 h-10 border-4 border-lime-600 rounded-full border-t-transparent"
    />
  </div>
{:then}
  {#if bookInfo.thumbnail}
    <img
      class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300"
      src={bookInfo.thumbnail}
      alt="test"
    />
  {:else}
    <div
      class="{isResponsiveText ? 'max-sm:hidden' : ''} justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
    >
      <span>No Image</span>
    </div>
    <div
      class="hidden {isResponsiveText ? 'max-sm:flex' : ''} justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
    >
      <span class="p-1 break-all collapseTitle">{bookInfo.title}</span>
    </div>
  {/if}
{:catch}
  <div
    class="{isResponsiveText ? 'max-sm:hidden' : ''} justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
  >
    <span>No Image</span>
  </div>
  <div
    class="hidden {isResponsiveText ? 'max-sm:flex' : ''} justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300"
  >
    <span class="p-1 break-all collapseTitle">{bookInfo.title}</span>
  </div>
{/await}
<div class="{isResponsiveText ? 'max-sm:hidden' : ''}">
  <span class="text-left px-2 text-lime-700 break-all collapseTitle">{bookInfo.title}</span>
</div>
<BottomStatusLabel {typeForLabel} {bookInfo} {isResponsiveText}/>

<style>
	.collapseTitle {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
</style>