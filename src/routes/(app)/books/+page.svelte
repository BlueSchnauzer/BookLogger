<script lang="ts">
	import type { PageData } from './$types';
	import type { toggleFilterItem, selectFilterItem } from '$lib/customTypes';
	import ContentHeader from '$lib/components/app/ContentHeader.svelte';
	import ContentFilters from '$lib/components/app/ContentFilters.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';

	//export let data: PageData;

	/**インプットの値*/
	let inputValue: string;
	/**リストの値*/
	let selectValue: number;

	let toggleFilterItems: toggleFilterItem[] = [
		{ id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true },
		{ id: 2, text: '読みたい', type: 'status', isChecked: false, isVisible: true },
		{ id: 3, text: '読んでいる', type: 'status', isChecked: false, isVisible: true },
		{ id: 4, text: '読み終わった', type: 'status', isChecked: false, isVisible: true }
	];
	let selectFilterItems: selectFilterItem[] = [
		{ id: 1, text: '最近追加した順' },
		{ id: 2, text: '最近読み終わった順' }
	];

    /**statusタイプのフィルター選択時に、他のstatusフィルターを非表示にする。
	 * 他のページでは非表示にするラベルが無いことと、onchangeで拾うと二重に検知するためここで管理。
	*/
    const changeStatusVisibility = () => {
        const checkedItem = toggleFilterItems.filter(item => item.type === 'status').find(item => item.isChecked);

        toggleFilterItems.forEach(item => {
            if (item.type === 'favorite' || item === checkedItem) { return; }

			if (checkedItem) {
				item.isVisible = false;
			} else {
				item.isVisible = true;
			}
        });
        toggleFilterItems = [...toggleFilterItems];
    }
	$: {
		//トグルフィルターの変更を検知する何かしらの処理を行う。
		changeStatusVisibility();
		console.log(toggleFilterItems);
	}

</script>

<div class="pl-2 pr-3 pt-1.5 h-24 flex flex-col justify-between">
	<ContentHeader headerIcon={BookCase} headerText="登録した本" isDisplayAddButton={true} />
	<ContentFilters bind:toggleFilterItems bind:inputValue {selectFilterItems} bind:selectValue />
</div>