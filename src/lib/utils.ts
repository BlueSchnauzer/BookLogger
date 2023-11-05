import { toast } from "@zerodevx/svelte-toast";
import type { BookInfo } from "$lib/server/models/BookInfo";
import type { ObjectId } from "mongodb";
import type { PageData } from "../routes/$types";

export const convertDate = (date: Date | string, useYear = true): string => {
	if (!date) { return 'データ無し'; }
	//DBから取った書誌データは文字列で日付を持ってるため
	if (typeof date === 'string') { date = new Date(date); }
	return `${useYear? `${date.getFullYear()}/` : ''}${date.getMonth() + 1}/${date.getDate()}`;
}

/**日付(読んだ記録)チェック */
export const validateReadingDate = (readingDate: string): boolean => {
	if (!readingDate) { return false; }

	return true;
}

/**ページ数(読んだ記録)チェック */
export const validateReadingCount = (readingCount: number, pageCount: number): boolean => {
	if (!readingCount || readingCount < 1 || pageCount < readingCount) {
		return false;
	}

	return true;
}

/**正常完了時のトースト表示(利用先でフレームのインポートとスタイル適用が必要)*/
export const pushSuccessToast = (message: string): void => {
	toast.push(message, { reversed: true, intro: { y: 100 }, theme: {'--toastBarBackground': '#65a30d'} });
}

/**異常完了時のトースト表示*/
export const pushErrorToast = (message: string): void => {
	toast.push(message, { reversed: true, intro: { y: 100 }, 
		theme:{ '--toastBarHeight': 0, '--toastWidth': 'auto', '--toastBackground': '#dc2626' } 
	});
}

/**成功用のトーストを表示し、編集内容を反映した書誌データを返す(再レンダリングに使用) */
export const handleSuccess = (bookInfos: BookInfo[], detail: {message: string, updatedItem: BookInfo, deletedId: ObjectId}): BookInfo[] => {
	if (detail.updatedItem) {
		const index = bookInfos.findIndex(item => item._id === detail.updatedItem._id);
		bookInfos = [...bookInfos.slice(0, index), detail.updatedItem, ...bookInfos.slice(index + 1)];
	}
	else if (detail.deletedId) {
		bookInfos = bookInfos.filter(item => item._id !== detail.deletedId);
	}
	pushSuccessToast(detail.message);

	return bookInfos;
}