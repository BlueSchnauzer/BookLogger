import { toast } from "@zerodevx/svelte-toast";

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
