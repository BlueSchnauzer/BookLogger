import type { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { BooksURLs, HomeURLs } from '$lib/client/Shared/Constants/urls';

export const getTitleLabel = (title?: string) => (!!title ? title : 'データ無し');

export const joinAuthorNames = (author: string[]) => author.join(', ');

export const getPageCountLabel = (pageCount: number) =>
	pageCount ? `${pageCount}ページ` : '0ページ';

export const isDisplayableProgress = (pageCount: number, pageHistories: PageHistory[]) =>
	pageCount > 0 && !!pageHistories && pageHistories?.length > 0;

export const getProgressByPercent = (pageCount: number, pageHistories: PageHistory[]) => {
	const ratio = Math.trunc((getMaxPageCountFromHistory(pageHistories)! / pageCount) * 100);
	return `${ratio.toString()}%`;
};

/**書誌データの日付を画面表示用の形式に変換する。 */
export const getDateLabel = (date: Date, useYear = true): string => {
	if (!date) {
		return 'データ無し';
	}

	//DBから取った書誌データは文字列で日付を持ってるため
	const target = typeof date === 'string' ? new Date(date) : date;
	return `${useYear ? `${target.getFullYear()}/` : ''}${target.getMonth() + 1}/${target.getDate()}`;
};

export const getTypeForBottomLabel = (pathName: string) => {
	switch (pathName) {
		case HomeURLs.home:
			return 'progress';
		case BooksURLs.books:
			return 'createDate';
		case BooksURLs.wish:
			return 'createDate';
		case BooksURLs.reading:
			return 'progress';
		default:
			return 'completeDate';
	}
};

const getMaxPageCountFromHistory = (pageHistories: PageHistory[]): number | undefined => {
	if (!pageHistories?.length) {
		return undefined;
	}

	return pageHistories?.reduce((max, item) => Math.max(max, item.value.pageCount), -Infinity)!;
};
