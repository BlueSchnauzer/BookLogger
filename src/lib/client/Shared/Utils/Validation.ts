import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';

/**日付(読んだ記録)チェック */
export const validateReadingDate = (readingDate: string): boolean => {
	return !!readingDate;
};

/**ページ数(読んだ記録)チェック */
export const validateReadingCount = (readingCount: number, pageCount: number): boolean => {
	if (!readingCount || readingCount < 1 || pageCount < readingCount) {
		return false;
	}

	return true;
};

export const validatePutBookInfo = (bookInfo: BookInfo, isCompleteReading: boolean): boolean => {
	let result = true;

	//作成直後はhistoryが空なのでそのままtrue、編集してある場合は中身が不正でないか調べる。
	if (!bookInfo.pageHistories) {
		return result;
	}
	bookInfo.pageHistories?.forEach((item) => {
		if (!result) {
			return;
		}

		if (!item.value.date) {
			result = false;
			return;
		}
		if (!validateReadingCount(item.value.pageCount, bookInfo.pageCount)) {
			result = false;
			return;
		}
	});

	//読み終わっている場合、最終ページの記録があるか確認
	if (isCompleteReading && result) {
		const isExist = bookInfo.pageHistories?.findIndex(
			(item) => item.value.pageCount === bookInfo.pageCount
		);
		result = isExist !== -1 ? true : false;
	}

	return result;
};
