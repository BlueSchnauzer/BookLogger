import type { ComponentType } from 'svelte';

/**メニューの項目データ */
export type menuItemData = {
	icon: ComponentType;
	ref: string;
	jpName: string;
	enName: string;
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

export type status = 'wish' | 'reading' | 'complete';