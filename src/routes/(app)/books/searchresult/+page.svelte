<script lang="ts">
    import BookAdd from '$lib/icons/BookAdd.svelte';
	import ContentHeader from '$lib/components/app/ContentHeader.svelte';
    import type { PageData } from './$types';
    
    //export let data: PageData;


</script>

<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
	<ContentHeader headerIcon={BookAdd} headerText="書籍追加" isDisplayAddButton={false} />
</div>
<div class="mx-2 my-1 bg-stone-400 h-[1px] xl:block" />
<div id="mainContent" class="p-1 contentHeight">
    <span>検索結果</span>
</div>

<style>
	.contentHeight {
        height: calc(100% - 96px);
    }

</style>