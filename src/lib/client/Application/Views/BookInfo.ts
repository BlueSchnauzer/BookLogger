import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { Identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import { convertReadingDateToDate, getCurrentDateString } from '$lib/client/Helpers/Date';
import { pushToast } from '$lib/client/Helpers/Toast';
import { validateReadingCount, validateReadingDate } from '$lib/client/Utils/Validation';
import type { ObjectId } from 'mongodb';

/**単一のBookInfoを受け取り、画面表示用に操作するView */
export class BookInfoView {
	id?: Id;
	userId: UserId;
	title: string;
	author: string[];
	thumbnail: string;
	createDate: Date;
	updateDate: Date;
	pageCount: number;
	isFavorite: boolean;
	status: Status;
	memorandum: string;
	isVisible: boolean;
	completeDate?: Date;
	pageHistories?: PageHistory[];
	identifiers?: Identifiers;
	shelfCategories?: ObjectId[];
	gapiId?: string;

	constructor(bookInfo: BookInfo) {
		this.id = bookInfo.id;
		this.userId = bookInfo.userId;
		this.title = bookInfo.title;
		this.author = bookInfo.author;
		this.thumbnail = bookInfo.thumbnail;
		this.createDate = bookInfo.createDate;
		this.updateDate = bookInfo.updateDate;
		this.pageCount = bookInfo.pageCount;
		this.isFavorite = bookInfo.isFavorite;
		this.status = bookInfo.status;
		this.memorandum = bookInfo.memorandum;
		this.isVisible = bookInfo.isVisible;
		this.completeDate = bookInfo.completeDate;
		this.pageHistories = bookInfo.pageHistories;
		this.identifiers = bookInfo.identifiers;
		this.shelfCategories = bookInfo.shelfCategories;
		this.gapiId = bookInfo.gapiId;
	}

	get titleLabel() {
		return !!this.title ? this.title : 'データ無し';
	}

	get pageCountLabel() {
		return !!this.pageCount ? `${this.pageCount}ページ` : '0ページ';
	}

	get isDisplayableProgress() {
		return this.pageCount > 0 && !!this.pageHistories && this.pageHistories?.length > 0;
	}

	/**ページ数に対して何ページ読んだかのパーセントを文字列で取得する。*/
	get progressByPercent() {
		//小数点を抜いて、パーセントに変換する。
		const ratio = Math.trunc((this.maxPageCountFromHistory! / this.pageCount) * 100);
		return `${ratio.toString()}%`;
	}

	/**書誌データの日付を画面表示用の形式に変換する。 */
	getDateLabel(dateType: 'create' | 'update' | 'complete', useYear = true): string {
		let target: Date | undefined;
		switch (dateType) {
			case 'create':
				target = this.createDate;
				break;
			case 'update':
				target = this.updateDate;
				break;
			case 'complete':
				target = this.completeDate;
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
	}

	/**グリッドアイテムのラベル表示用のタイプを判定して返す。 */
	getTypeForBottomLabel(pathName: string) {
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
	}

	addPageHistory(readingDate: string, readingCount: number) {
		const isValidDate = validateReadingDate(readingDate);
		const isValidCount = validateReadingCount(readingCount, this.pageCount);
		if (!isValidDate || !isValidCount) {
			const errorMessage = !isValidDate
				? '日付が未入力です'
				: `ページ数は1～${this.pageCount}ページで入力してください`;
			return { isSuccess: false, errorMessage };
		}

		const item = new PageHistory({
			date: convertReadingDateToDate(readingDate),
			pageCount: readingCount
		});

		if (this.pageHistories && this.pageHistories.length) {
			this.pageHistories.push(item);
		} else {
			this.pageHistories = [item];
		}

		if (this.status.value === 'wish' && this.pageHistories.length === 1) {
			this.status = new Status('reading');
			pushToast('ステータスを「読んでいる本」に変更しました。');
		} else if (this.status.value !== 'complete' && readingCount === this.pageCount) {
			this.status = new Status('complete');
			pushToast('ステータスを「読み終わった本」に変更しました。');
		}

		return { isSuccess: true };
	}

	deletePageHistory(id: string) {
		if (!id || !this.pageHistories?.length) {
			return;
		}

		this.pageHistories = this.pageHistories?.filter((item) => item.value.id !== id);
	}

	addPageHistoryWhenComplete() {
		if (this.status.value !== 'complete' || this.hasCompleteHistory) {
			return;
		}
		this.addPageHistory(getCurrentDateString(), this.pageCount);

		pushToast('最後のページまでの読んだ記録を追加しました。');
	}

	private get maxPageCountFromHistory(): number | undefined {
		if (!this.pageHistories?.length) {
			return undefined;
		}
		return this.pageHistories?.reduce(
			(max, item) => Math.max(max, item.value.pageCount),
			-Infinity
		)!;
	}

	private get hasCompleteHistory() {
		if (!this.pageHistories?.length) {
			return false;
		}

		let result = false;
		this.pageHistories?.forEach((item) => {
			if (item.value.pageCount === this.pageCount) {
				result = true;
			}
		});

		return result;
	}
}
