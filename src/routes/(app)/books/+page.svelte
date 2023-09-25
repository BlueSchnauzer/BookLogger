<script lang="ts">
	import type { PageData } from './$types';
	import type { toggleFilterItem } from '$lib/customTypes';
	import Icon from '@iconify/svelte';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	//iOS Safariなど用に追加
	import ResizeObserver from 'resize-observer-polyfill';
	import { onMount } from 'svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import ToggleSwitch from '$lib/parts/ToggleSwitch.svelte';
	import FullCoverZindex10 from '$lib/parts/FullCoverZindex10.svelte';
	type selectFilterItem = { id: number; text: string };

	//export let data: PageData;

	const colorStone700 = '#44403C';
	let isDisplayInput = false;
	let inputValue: string;
	let isDisplaySelect = false;
	let selectValue: number;
	const setSelectValue = (id:number) : void => {
		selectValue = id;
		isDisplaySelect = false;
	}

	let togglerFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true },
		{ id: 3, text: '読んでいる', type: 'status', isChecked: false, isVisible: true },
		{ id: 4, text: '読み終わった', type: 'status', isChecked: false, isVisible: true }
	];
	let selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' },
		{ id: 2, text: '最近読み終わった順' }
	];

	/**トグルフィルターのチェックを外す*/
	const removeAllToggleCheck = (): void => {
		togglerFilterItems.forEach((item) => {
			item.isChecked = false;
			item.isVisible = true;
		});
		togglerFilterItems = [...togglerFilterItems];
	};
	/**statusタイプのフィルター選択時に、他のstatusフィルターを非表示にする*/
	const changeOtherStatusVisibility = (event: CustomEvent): void => {
		const clickItem = togglerFilterItems.find((item) => item.id === event.detail.id);
		if (clickItem?.type === 'favorite') {
			return;
		}
		togglerFilterItems.forEach((item) => {
			if (item.type === 'favorite' || item === clickItem) {
				return;
			}
			//イベント発火 → `checked`の値変更、の順番なのでboolを反転させて判定
			if (!clickItem?.isChecked) {
				item.isVisible = false;
			} else {
				item.isVisible = true;
			}
		});
		togglerFilterItems = [...togglerFilterItems];
	};

	onMount(() => {
		//SSR時のエラー回避のためDOM生成後に実行
		window.ResizeObserver = ResizeObserver;
		const labelContainer = window.document.querySelector<HTMLElement>('#labelContainer');
		if (labelContainer) {
			new SimpleBar(labelContainer);
		}
	});
</script>

<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
	<div class="flex items-center justify-between">
		<div class="flex">
			<BookCase width={30} height={30} />
			<h1 class="text-xl pl-2">登録した本</h1>
		</div>
		<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300">
			<Icon icon="ph:plus" width="36" height="36" color={colorStone700} />
		</button>
	</div>
	<div class="flex justify-between items-center">
		<div id="labelContainer" class="flex items-center w-96 max-lg:w-60">
			<ul class="w-96 flex items-center">
				<li class="flex">
					<button
						on:click={removeAllToggleCheck}
						class={togglerFilterItems.some((item) => item.isChecked) ? '' : 'hidden'}
					>
						<Icon icon="ph:x" width="24" height="24" />
					</button>
				</li>
				{#each togglerFilterItems as item (item.id)}
					<li>
						<ToggleSwitch
							id={item.id}
							text={item.text}
							isVisible={item.isVisible}
							bind:isChecked={item.isChecked}
							on:change={changeOtherStatusVisibility}
						/>
					</li>
				{/each}
			</ul>
		</div>
		<div class="flex items-center">
			<div class="pl-2 flex items-center">
				<input
					name="filter"
					type="text"
                    size="15"
					placeholder="書名、作者名..."
					bind:value={inputValue}
					class="absolute -ml-40 px-2 py-1 rounded-lg duration-300 transition-all {isDisplayInput ? 'animate-scale-in-right' : 'hidden'}"
				/>
				<button
					class="ml-2 h-10 w-10 rounded-full flex justify-center items-center bg-stone-300 border border-stone-300
                        duration-150 hover:bg-stone-200"
					on:click={() => isDisplayInput = !isDisplayInput}
				>
					<Icon icon="ph:magnifying-glass" width="28" height="28" color={colorStone700} />
				</button>
			</div>
			<div>
				<button
					class="z-20 relative ml-2 h-10 w-10 rounded-full flex justify-center items-center bg-stone-300 border border-stone-300
                        duration-150 hover:bg-stone-200"
						on:click={() => isDisplaySelect = !isDisplaySelect}
				>
					<Icon icon="ph:list-magnifying-glass" width="28" height="28" color={colorStone700} />
				</button>
				<ul class="z-30 absolute w-40 mt-1 -ml-28 bg-stone-200 border border-stone-300 rounded shadow-lg {isDisplaySelect ? '' : 'hidden'}">
					{#each selectFilterItems as item (item.id) }
						<li class="flex duration-150 hover:bg-stone-300">
							<button class="flex flex-1 px-2 py-1" on:click={() => setSelectValue(item.id)}>{item.text}</button>
						</li>
					{/each}
				</ul>
			</div>
			<FullCoverZindex10 bind:isDisplay={isDisplaySelect} isHiddenByOnclick={true} />
		</div>
	</div>
</div>