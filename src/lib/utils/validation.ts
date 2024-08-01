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