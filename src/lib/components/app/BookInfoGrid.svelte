<script lang="ts">
	import type { IBookInfo } from '$lib/server/models/BookInfo';
    import { setBookInfoByISBN } from '$lib/GoogleBooksAPI/RequestManage';

	export let bookInfos: IBookInfo[];

</script>

<ul
	class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center"
>
	{#each bookInfos as bookInfo (bookInfo._id)}
		{#if bookInfo.isVisible}
			<li
				class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-md"
				title={bookInfo.title}
			>
				{#await setBookInfoByISBN(bookInfo)}
					<div class="justify-self-center self-center flex items-center justify-center w-[128px] h-[182px] border border-slate-300">
						<span class="animate-spin w-10 h-10 border-4 border-lime-600 rounded-full border-t-transparent"></span>
					</div>
				{:then}
					{#if bookInfo.imageUrl}
						<img
							class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300"
							src={bookInfo.imageUrl}
							alt="test"
						/>						
					{:else}
						<div class="max-sm:hidden justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300">
							<span>No Image</span>
						</div>
						<div class="hidden max-sm:flex justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300">
							<span class="p-1 break-all collapseTitle">{bookInfo.title}</span>
						</div>
					{/if}	
				{:catch}
					<div class="max-sm:hidden justify-self-center self-center flex flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300">
						<span>No Image</span>
					</div>
					<div class="hidden max-sm:flex justify-self-center self-center flex-col items-center justify-center w-[128px] h-[182px] bg-slate-300">
						<span class="p-1 break-all collapseTitle">{bookInfo.title}</span>
					</div>
				{/await}
				<div class="max-sm:hidden">
					<a href="" class="px-2 text-lime-700 break-all collapseTitle" tabindex="0"
						>{bookInfo.title}</a
					>
				</div>
				<div class="self-center flex justify-between max-sm:hidden">
					<span class="pl-2 text-xs">登録日</span>
					<span class="pr-2 text-sm">2023年9月20日</span>
				</div>
			</li>
		{/if}
	{/each}
</ul>

<style>
	.collapseTitle {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
	}
</style>
