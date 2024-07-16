import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";

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

export const validatePutBookInfo = ({ bookInfo, isCompleteReading }: { bookInfo: BookInfo, isCompleteReading: boolean }): boolean => {
  let result = true;

  //作成直後はhistoryが空なのでそのままtrue、編集してある場合は中身が不正でないか調べる。
  if (!bookInfo.getPageHistories()) { return result; }
  bookInfo.getPageHistories()?.forEach(item => {
    if (!result) { return; }

    if (!item.value.date) {
      result = false;
      return;
    }
    if (!validateReadingCount(item.value.pageCount, bookInfo.getPageCount())) {
        result = false;
        return;
    }
  });

  //読み終わっている場合、最終ページの記録があるか確認
  if (isCompleteReading && result) {
    const isExist = bookInfo.getPageHistories()?.findIndex(item => item.value.pageCount === bookInfo.getPageCount());
    result = isExist !== -1 ? true : false;
  }

  return result;
}