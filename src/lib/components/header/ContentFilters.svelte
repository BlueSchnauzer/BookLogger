<script lang="ts">
	import type { toggleFilterItem, selectFilterItem, menuItemData } from '$lib/customTypes';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';

	/**トグルフィルター*/
	export let toggleFilterItems: toggleFilterItem[];
	/**インプットの値*/
	export let inputValue: string;
	/**リストフィルター*/
	export let selectFilterItems: selectFilterItem[];
	/**リストの値*/
	export let selectValue: number;

	const MenuItemDatas: menuItemData[] = [
		{ ref: '/books', name: '全ての本' },
		{ ref: '/books/wish', name: '読みたい'},
		{ ref: '/books/reading', name: '読んでいる'},
		{ ref: '/books/complete', name: '読み終わった'}
	];

	//ページ移動の度に対応したページにスタイルを当てる
	let pathName: string;
	$: pathName = $page.url.pathname;	

	const colorStone700 = '#44403C';
	let isDisplayInput = false;
	let isDisplaySelect = false;

	const setSelectValue = (id: number): void => {
		selectValue = id;
		isDisplaySelect = false;
	};
	/**トグルフィルターのチェックを外す*/
	const removeAllToggleCheck = (): void => {
		toggleFilterItems.forEach((item) => {
			item.isChecked = false;
			item.isVisible = true;
		});
		toggleFilterItems = [...toggleFilterItems];
	};

</script>

<div class="flex justify-between items-center">
	<ul class="flex items-center -mb-[9px]">
		{#each MenuItemDatas as item }
			<li class="h-10 px-2 whitespace-nowrap 
				rounded-t-xl
				{item.ref === '/books'? 'border-x bg-vellum' : 'border-r'} 
				border-t border-stone-500 bg-stone-300">
				<a href={item.ref} class="leading-10">
					<p>{item.name}</p>
				</a>
			</li>
		{/each}
	</ul>
	<div class="flex items-center">
		<div class="pl-2 flex items-center">
			<input name="filter" type="text" size="15"
			 	placeholder="タイトル、著者名..."	bind:value={inputValue}
				class="absolute -ml-40 px-2 py-1 rounded-lg duration-300 transition-all 
				{isDisplayInput	? 'animate-scale-in-right' : 'hidden'}"
			/>
			<button data-testid="btnDisplayFilterText"
				class="ml-2 h-10 w-10 rounded-full flex justify-center items-center bg-stone-300 border border-stone-300 duration-150 hover:bg-stone-200"
				title="検索" on:click={() => (isDisplayInput = !isDisplayInput)}
			>
				<Icon icon="ph:magnifying-glass" width="28" height="28" color={colorStone700} />
			</button>
		</div>
		<div>
			<button data-testid="btnDisplayFilterOptions"
				class="relative ml-2 h-10 w-10 rounded-full flex justify-center items-center bg-stone-300 border border-stone-300 duration-150 hover:bg-stone-200"
				title="並び替え" on:click={() => (isDisplaySelect = !isDisplaySelect)}
			>
				<Icon icon="ph:list-magnifying-glass" width="28" height="28" color={colorStone700} />
			</button>
			<ul data-testid="filterOptions"
				class="z-10 absolute w-40 mt-1 -ml-28 bg-stone-200 border border-stone-300 rounded shadow-lg 
				{isDisplaySelect ? '' : 'hidden'}"
			>
				{#each selectFilterItems as item (item.id)}
					<li class="flex duration-150 hover:bg-stone-300">
						<button class="flex flex-1 px-2 py-1" on:click={() => setSelectValue(item.id)}
							>{item.text}</button
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	/* ウィンドウサイズが小さい時にトグルメニューの右端を半透明にする。 */
	@media not all and (min-width: 1024px) {
		.edgeGradiation::after {
			content: '';
			position: absolute;
			width: 20px;
			height: 100%;
			right: 0;
			background: linear-gradient(to left, #eeeae3 0%, rgba(255, 255, 255, 0) 100%);
			pointer-events: none;
		}
	}
</style>
