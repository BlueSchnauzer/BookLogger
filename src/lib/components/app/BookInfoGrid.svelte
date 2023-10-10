<script lang="ts">
	import type { IBookInfo } from '$lib/server/models/BookInfo';
	import { PUBLIC_BOOKSAPI_LIST } from '$env/static/public';
	import type { books_v1 } from 'googleapis';

	export let bookInfos: IBookInfo[];

	async function requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
		const response = await gapi.client.request({
			path: PUBLIC_BOOKSAPI_LIST,
			params: {
				q: query
			}
		});
		// レスポンスのボディをbooks_v1.Schema$Volumes型として返す
		return response.result as books_v1.Schema$Volumes;
	}
    /**GoogleBooksAPIに書影をリクエストする*/
	async function getImage(query: string): Promise<string> {
		const result = await requestBookInfo(`isbn:${query}`);
		if (result.items?.length === 0 || !result.items) {
			throw new Error('This books image was not found in GoogleBooksAPI');
		}

		const thumbnail = result.items[0].volumeInfo?.imageLinks?.thumbnail;
		if (thumbnail) {
			return thumbnail;
		} else {
			throw new Error('This books image was not found in GoogleBooksAPI');
		}
	}
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
				{#await getImage(bookInfo.isbn_13)}
					<div class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300">
						Loading!
					</div>
				{:then thumbnail}
					<img
						class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300"
						src={thumbnail}
						alt="test"
					/>
				{:catch}
					<div class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300">
						No Image
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
