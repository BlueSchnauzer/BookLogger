<script lang="ts">
	import type { PageData } from './$types';
	import type { filterToggleItem } from '$lib/customTypes';
	import Icon from '@iconify/svelte';
	import SimpleBar from 'simplebar';
	import 'simplebar/dist/simplebar.css';
	//iOS Safariなど用に追加
	import ResizeObserver from 'resize-observer-polyfill';
	import { onMount } from 'svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import ToggleSwitch from '$lib/parts/ToggleSwitch.svelte';

	//export let data: PageData;

	const colorStone700 = '#44403C';
	let filterToggleItems: filterToggleItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true },
		{ id: 3, text: '読んでいる', type: 'status', isChecked: false, isVisible: true },
		{ id: 4, text: '読み終わった', type: 'status', isChecked: false, isVisible: true }
	];

	/**全てのフィルターのチェックを外す*/
	const removeAllToggleCheck = (): void => {
		filterToggleItems.forEach((item) => {
			item.isChecked = false;
			item.isVisible = true;
		});
		filterToggleItems = [...filterToggleItems];
	};
	/**statusタイプのフィルター選択時に、他のstatusフィルターを非表示にする*/
	const changeOtherStatusVisibility = (event: CustomEvent): void => {
		const clickItem = filterToggleItems.find((item) => item.id === event.detail.id);
		if (clickItem?.type === 'favorite') {
			return;
		}
		filterToggleItems.forEach((item) => {
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
		filterToggleItems = [...filterToggleItems];
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
	<div>
		<div id="labelContainer" class="pb-2 flex items-center">
			<ul class="flex items-center">
                <li class="flex">
                    <button on:click={removeAllToggleCheck} class="{filterToggleItems.some((item) => item.isChecked) ? '' : 'hidden'}">
                        <Icon icon="ph:x" width="24" height="24" />
                    </button>        
                </li>
				{#each filterToggleItems as item (item.id)}
					<li>
						<ToggleSwitch
							id={item.id} text={item.text} isVisible={item.isVisible}
							bind:isChecked={item.isChecked}
							on:change={changeOtherStatusVisibility}
						/>
					</li>
				{/each}
			</ul>
		</div>
        <div>
            
        </div>
	</div>
	<!-- <div>
        {#each filterToggleItems as item (item.id)}
            <span>
                {item.isChecked? `checked ${item.text}` : 'unchecked'}
            </span>
        {/each}
    </div> -->
</div>
