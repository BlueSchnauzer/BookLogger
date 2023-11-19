<script lang='ts'>
	import type { typeForBottomLabel } from '$lib/customTypes';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { convertDate } from '$lib/utils';

  export let typeForLabel : typeForBottomLabel;
  export let bookInfo: BookInfo;
</script>


{#if typeForLabel === 'createDate'}
  <div class="self-center flex justify-between max-sm:hidden">
    <span class="pl-2 text-xs">登録日</span>
    <span class="pr-2 text-sm">{convertDate(bookInfo.createDate)}</span>
  </div>
{:else if typeForLabel === 'completeDate'}
  <div class="self-center flex justify-between max-sm:hidden">
    <span class="pl-2 text-xs">読み終わった日</span>
    <span class="pr-2 text-sm">{convertDate(bookInfo.completeDate)}</span>
  </div>
{:else}
  <div class="self-center flex justify-between max-sm:hidden">
    <span class="pl-2 text-xs">progressを出す予定</span>
    <span class="pr-2 text-sm">{convertDate(bookInfo.createDate)}</span>
  </div>
{/if}