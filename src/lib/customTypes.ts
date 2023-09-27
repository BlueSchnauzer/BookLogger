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

/**書誌情報 */
export type bookInfo = {
	id: number;
	isVisible: boolean;
	isbn_13: string;
	isbn_10?: string;
	title: string;
	imageUrl: string;
	registrationDate: Date;
	updateDate: Date;
	pageCount: number;
	history: [
		{
			date: Date;
			currentPage: number;
		}
	];
	isCompleted: boolean;
	memorandum: string;
};
