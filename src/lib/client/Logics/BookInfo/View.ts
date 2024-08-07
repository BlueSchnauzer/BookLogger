import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { BottomLabelType } from '$lib/client/Utils/types';

export const bookInfoView = (bookInfo: BookInfo) => {
	const titleLabel = () => {
		return !!bookInfo.title ? bookInfo.title : 'データ無し';
	};

	const joinedAuthors = () => {
		return bookInfo.author.join(', ');
	};

	const pageCountLabel = () => {
		return !!bookInfo.pageCount ? `${bookInfo.pageCount}ページ` : '0ページ';
	};

	const isDisplayableProgress = () => {
		return bookInfo.pageCount > 0 && !!bookInfo.pageHistories && bookInfo.pageHistories?.length > 0;
	};

	/**ページ数に対して何ページ読んだかのパーセントを文字列で取得する。*/
	const progressByPercent = () => {
		//小数点を抜いて、パーセントに変換する。
		const ratio = Math.trunc((maxPageCountFromHistory()! / bookInfo.pageCount) * 100);
		return `${ratio.toString()}%`;
	};

	/**書誌データの日付を画面表示用の形式に変換する。 */
	const dateLabel = (dateType: 'create' | 'update' | 'complete', useYear = true): string => {
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
	const typeForBottomLabel = (pathName: string): BottomLabelType => {
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

	const maxPageCountFromHistory = (): number | undefined => {
		if (!bookInfo.pageHistories?.length) {
			return undefined;
		}

		return bookInfo.pageHistories?.reduce(
			(max, item) => Math.max(max, item.value.pageCount),
			-Infinity
		)!;
	};

	return {
		titleLabel,
		joinedAuthors,
		pageCountLabel,
		isDisplayableProgress,
		progressByPercent,
		dateLabel,
		typeForBottomLabel,
		maxPageCountFromHistory
	};
};
