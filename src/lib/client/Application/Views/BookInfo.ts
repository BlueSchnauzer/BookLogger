import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import type { PageHistory } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';

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
		case '/home':
			return 'progress';
		case '/books':
			return 'createDate';
		case '/books/wish':
			return 'createDate';
		case '/books/reading':
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

export const bookInfoView = (bookInfo: BookInfo) => {
	const getTitleLabel = () => {
		return !!bookInfo.title ? bookInfo.title : 'データ無し';
	};

	const joinedAuthors = () => {
		return bookInfo.author.join(', ');
	};

	const getPageCountLabel = () => {
		return !!bookInfo.pageCount ? `${bookInfo.pageCount}ページ` : '0ページ';
	};

	const isDisplayableProgress = () => {
		return bookInfo.pageCount > 0 && !!bookInfo.pageHistories && bookInfo.pageHistories?.length > 0;
	};

	/**ページ数に対して何ページ読んだかのパーセントを文字列で取得する。*/
	const getProgressByPercent = () => {
		//小数点を抜いて、パーセントに変換する。
		const ratio = Math.trunc((getMaxPageCountFromHistory()! / bookInfo.pageCount) * 100);
		return `${ratio.toString()}%`;
	};

	/**書誌データの日付を画面表示用の形式に変換する。 */
	const getDateLabel = (dateType: 'create' | 'update' | 'complete', useYear = true): string => {
		let target: Date | undefined;
		switch (dateType) {
			case 'create':
				target = bookInfo.createDate;
				break;
			case 'update':
				target = bookInfo.updateDate;
				break;
			case 'complete':
				target = bookInfo.completeDate;
				break;
		}
		if (!target) {
			return 'データ無し';
		}

		//DBから取った書誌データは文字列で日付を持ってるため
		if (typeof target === 'string') {
			target = new Date(target);
		}
		return `${useYear ? `${target.getFullYear()}/` : ''}${target.getMonth() + 1}/${target.getDate()}`;
	};

	/**グリッドアイテムのラベル表示用のタイプを判定して返す。 */
	const getTypeForBottomLabel = (pathName: string) => {
		switch (pathName) {
			case '/home':
				return 'progress';
			case '/books':
				return 'createDate';
			case '/books/wish':
				return 'createDate';
			case '/books/reading':
				return 'progress';
			default:
				return 'completeDate';
		}
	};

	const getMaxPageCountFromHistory = (): number | undefined => {
		if (!bookInfo.pageHistories?.length) {
			return undefined;
		}

		return bookInfo.pageHistories?.reduce(
			(max, item) => Math.max(max, item.value.pageCount),
			-Infinity
		)!;
	};

	return {
		getTitleLabel,
		joinedAuthors,
		getPageCountLabel,
		isDisplayableProgress,
		getProgressByPercent,
		getDateLabel,
		getTypeForBottomLabel,
		getMaxPageCountFromHistory
	};
};
