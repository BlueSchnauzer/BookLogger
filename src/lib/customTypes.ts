import type { ComponentType } from 'svelte';

/**メニューの項目データ */
export type menuItemData = {
	icon: ComponentType;
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

/**読書記録 */
export type readingHistory = {
	date: Date,
	currentPage: number
}

/**書誌データのステータス */
export type status = 'wish' | 'reading' | 'complete';
/**一覧画面でのラベル種別 */
export type typeForBottomLabel = 'createDate' | 'updateDate' | 'progress' | 'completeDate';