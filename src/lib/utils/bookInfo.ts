import type { BookInfo } from "$lib/server/models/BookInfo";
import type { ObjectId } from "mongodb";
import type { toggleFilterItem, typeForBottomLabel } from "$lib/customTypes";
import { pushSuccessToast } from "$lib/utils/toast";

/**編集内容を反映した書誌データを返す(再レンダリングに使用) */
export const applyChangesToBookInfos = (bookInfos: BookInfo[], detail: {message: string, updatedItem: BookInfo, deletedId: ObjectId}): BookInfo[] => {
	let appliedItems = bookInfos;

	if (detail.updatedItem) {
		const index = bookInfos.findIndex(item => item._id === detail.updatedItem._id);
		appliedItems = [...bookInfos.slice(0, index), detail.updatedItem, ...bookInfos.slice(index + 1)];
	}
	else if (detail.deletedId) {
		appliedItems = bookInfos.filter(item => item._id !== detail.deletedId);
	}

	return appliedItems;
}

/**成功用トーストを表示し、編集内容を反映した書誌データを返す(再レンダリングに使用) */
export const handleSuccess = (bookInfos: BookInfo[], detail: {message: string, updatedItem: BookInfo, deletedId: ObjectId}, target: string): BookInfo[] => {
	const appliedItems = applyChangesToBookInfos(bookInfos, detail);
	pushSuccessToast(detail.message, target);

	return appliedItems;
}

/**お気に入り状態の書誌データのみを表示状態にして返す(再レンダリングに使用) */
export const toggleFavorite = (bookInfos: BookInfo[], filter: toggleFilterItem): BookInfo[] => {
	if (filter.type !== 'favorite') { return bookInfos; }
	
	//一応ディープコピー
	const toggledItems = structuredClone(bookInfos);

	if (filter.isChecked) {
		toggledItems.forEach(item => {
			if (!item.isFavorite) { item.isVisible = false; }
		});
	}
	else {
		toggledItems.forEach(item => item.isVisible = true);
	}

	return toggledItems;
}

/**グリッドアイテムのラベル表示用のタイプを判定して返す。 */
export const getTypeForBottomLabel = (pathName: string): typeForBottomLabel => {
	const typeForLabel = 
		pathName === '/books' ? 'updateDate'
			: pathName === '/books/reading' ? 'progress'
			: pathName === '/books/complete' ? 'completeDate'
			: 'createDate';

	return typeForLabel;
}

export const convertDate = (date: Date | string | undefined, useYear = true): string => {
	if (!date) { return 'データ無し'; }
	//DBから取った書誌データは文字列で日付を持ってるため
	if (typeof date === 'string') { date = new Date(date); }
	return `${useYear? `${date.getFullYear()}/` : ''}${date.getMonth() + 1}/${date.getDate()}`;
}