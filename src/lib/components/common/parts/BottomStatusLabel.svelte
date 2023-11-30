<script lang='ts'>
	import type { typeForBottomLabel } from '$lib/customTypes';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import type { BookInfo } from '$lib/server/models/BookInfo';
	import { convertDate } from '$lib/utils/bookInfo';
	import Icon from '@iconify/svelte';

  export let typeForLabel : typeForBottomLabel;
  export let bookInfo: BookInfo;
	const colorStone700 = '#44403C';
</script>


{#if typeForLabel === 'createDate'}
  <div class="self-center flex justify-between max-sm:hidden">
    <div class="pl-2 flex items-center">
      <Icon icon="mdi:pencil-plus-outline" width="18" height="18" color={colorStone700}/>
      <span class="pl-1 text-xs">登録日</span>
    </div>
    <span class="pr-2 text-sm">{convertDate(bookInfo.createDate)}</span>
  </div>
{:else if typeForLabel === 'completeDate'}
  <div class="self-center flex justify-between max-sm:hidden">
    <div class="pl-2 flex items-center">
      <CompleteBook width={18} height={18} color={colorStone700}/>
      <span class="pl-1 text-xs">読み終わった日</span>
    </div>
    <span class="pr-2 text-sm">{convertDate(bookInfo.completeDate)}</span>
  </div>
{:else}
  <div class="self-center flex justify-between max-sm:hidden">
    <span class="pl-2 text-xs">progressを出す予定</span>
    <span class="pr-2 text-sm">{convertDate(bookInfo.createDate)}</span>
  </div>
{/if}