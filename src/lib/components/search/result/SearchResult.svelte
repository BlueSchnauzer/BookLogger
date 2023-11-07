<script lang="ts">
	import type { books_v1 } from 'googleapis';
	import { createEventDispatcher } from 'svelte';
	import InfoLabel from '$lib/components/common/parts/CategoryLabel.svelte';

	export let runPromise: () => Promise<books_v1.Schema$Volumes>;

	/**著者が複数名いる場合に句点で区切る*/
	const joinArray = (arry: string[] | undefined): string => {
		if (!arry) { return '';	}

		let result: string;
		//多すぎる場合は短縮
		if (arry.length >= 6) {
			arry = arry.slice(0, 5);
			result = arry.join(', ') + '...';
		} else {
			result = arry.join(', ');
		}
		return result;
	};

	const getLabel = (data?: string | number): string => {
		return data?.toString() ?? 'データ無し';
	};

	const dispatch = createEventDispatcher();
	const handleClick = (item: books_v1.Schema$Volume) => {
		dispatch('click', item);
	};
</script>

{#await runPromise()}
	<div class="flex flex-1 justify-center items-center">
		<span class="animate-spin w-14 h-14 border-4 border-lime-600 rounded-full border-t-transparent" />
	</div>
{:then result}
	{#if result.items}
		<ul>
			{#each result.items as item (item.id)}
				<li class="flex">
					<button	class="p-2 my-2 flex flex-auto bg-gray-100 rounded-lg shadow-md" on:click={() => handleClick(item)}>
						{#if item.volumeInfo?.imageLinks?.thumbnail}
							<img class="flex-shrink-0 self-center w-[128px] h-[182px] shadow-md"
								title={getLabel(item.volumeInfo?.title)} src={item.volumeInfo?.imageLinks?.thumbnail}	alt="書影"
							/>
						{:else}
							<div class="flex-shrink-0 self-center flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300"
								title={getLabel(item.volumeInfo?.title)}
							>
								<span>No Image</span>
							</div>
						{/if}
						<div class="p-2 flex flex-col items-start text-left">
							{#if item.volumeInfo?.title}
								<span class="text-lg font-bold text-lime-700">{item.volumeInfo?.title}</span>
							{:else}
								<span class="text-lg font-bold text-gray-400">データ無し</span>
							{/if}
							<div class="p-2 flex flex-col items-start">
								<InfoLabel
									categoryText="著者"
									condition={item.volumeInfo?.authors}
									labelFunction={() => joinArray(item.volumeInfo?.authors)}
								/>
								<InfoLabel
									categoryText="発売日"
									condition={item.volumeInfo?.publishedDate}
									labelFunction={() => item.volumeInfo?.publishedDate}
								/>
								<div class="p-2">
									<p class="collapseDescription">{item.volumeInfo?.description ?? ''}</p>
								</div>
							</div>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
{:catch error}
	<span class="text-red-500 font-medium">{error.message}</span>
{/await}

<style>
	.collapseDescription {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
	}
</style>
