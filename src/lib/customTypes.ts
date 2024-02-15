import type { ComponentType } from 'svelte';

/**メニューの項目データ */
export type menuItemData = {
	icon?: ComponentType;
	ref: string;
	name: string;
};

/**ラベルフィルター(トグル) */
export type toggleFilterItem = {
	id: number;
	text: string;
	type: 'favorite' | 'status';
	isChecked: boolean;
	isVisible: boolean;
};

export type selectFilterItem = { 
	id: number;
	text: string; 
};

/**書誌データのステータス */
export type status = 'wish' | 'reading' | 'complete';
/**一覧画面でのラベル種別 */
export type typeForBottomLabel = 'createDate' | 'progress' | 'completeDate';
/**検索画面での検索タイプ */
export type searchType = 'none' | 'fuzzy' | 'detail';