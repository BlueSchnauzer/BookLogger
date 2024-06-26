import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status, type status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { Id } from '$lib/server/Domain/ValueObjects/BookInfo/Id';
import { PageHistory, type pageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers, type identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import type MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import type { books_v1 } from 'googleapis';
import { validateReadingDate } from '$lib/client/Application/Utils/validation';

/**書誌情報のEntity */
export class BookInfo {
	public id?: Id;
	public userId: UserId;
	public title: string;
	public author: string[];
	public thumbnail: string;
	public createDate: Date;
	public updateDate: Date;
	public pageCount: number;
	public isFavorite: boolean;
	public status: Status;
	public memorandum: string;
	public isVisible: boolean;
	public completeDate?: Date;
	public pageHistories?: PageHistory[];
	public identifiers?: Identifiers;
	public shelfCategories?: ObjectId[]
	public gapiId?: string;

	constructor(volume: books_v1.Schema$Volume, userId: string);
	constructor(properties: bookInfoProperties);

	/**BookInfoのEntityを生成(MongoDBのモデルを渡して生成する) */
	constructor(resource: bookInfoProperties | books_v1.Schema$Volume, userId?: string) {
		if (isBookInfoProperties(resource)){
			this.id = new Id(resource.id);
			this.userId = new UserId(resource.userId);
			this.title = resource.title;
			this.author = resource.author;
			this.thumbnail = resource.thumbnail;
			this.createDate = resource.createDate;
			this.updateDate = resource.updateDate;
			this.pageCount = resource.pageCount;
			this.isFavorite = resource.isFavorite;
			this.status = new Status(resource.status);
			this.memorandum = resource.memorandum;
			this.isVisible = resource.isVisible;
			this.completeDate = resource.completeDate;
			this.pageHistories = resource.pageHistories ? resource.pageHistories?.map(item => new PageHistory(item)) : [];
			this.identifiers = resource.identifiers != undefined ? new Identifiers(resource.identifiers) : undefined;
			this.shelfCategories = resource.shelfCategories;
			this.gapiId = resource.gapiId;
		}
		else {
			const currentDate = new Date;

			this.userId = new UserId(userId!);
			this.title = resource!.volumeInfo?.title ?? '';
			this.author = resource!.volumeInfo?.authors ?? [''];
			this.thumbnail = resource!.volumeInfo?.imageLinks?.thumbnail ?? ''; //gapi固有の情報だが、画像そのものではなく場所を表すURLを保存する。
			this.createDate = currentDate;
			this.updateDate = currentDate;
			this.pageCount = resource!.volumeInfo?.pageCount ?? 0;
			this.isFavorite = false;
			this.status = new Status('wish');
			this.memorandum = '';
			this.isVisible = true;
			this.identifiers = new Identifiers(getIdentifier(resource!.volumeInfo?.industryIdentifiers)!);
			this.gapiId = resource!.id ?? this.title; //gapi固有の情報なので入れたら微妙な感じではある
		}
	}

	/**MongoDBModelからEntityを生成する */
	public static fromDBModel(mongoModel: MongoDBModel) {
		return new BookInfo({
			id: mongoModel._id?.toString()!,
			userId: mongoModel.userId,
			title: mongoModel.title,
			author: mongoModel.author,
			thumbnail: mongoModel.thumbnail,
			createDate: mongoModel.createDate,
			updateDate: mongoModel.updateDate,
			pageCount: mongoModel.pageCount,
			isFavorite: mongoModel.isFavorite,
			status: mongoModel.status,
			memorandum: mongoModel.memorandum,
			isVisible: mongoModel.isVisible,
			completeDate: mongoModel.completeDate,
			pageHistories: mongoModel.pageHistories,
			identifiers: mongoModel.identifiers,
			shelfCategories: mongoModel.shelfCategories,
			gapiId: mongoModel.gapiId
		}
		);
	}

  /**pageHisotryを追加する。 */
  public addPageHistory(readingDate: string, readingCount: number) {
		// isValidDate = validateReadingDate(readingDate);
		// isValidCount = validateReadingCount(readingCount, bookInfo.pageCount);
		// if (!isValidDate || !isValidCount) { return; }

		const item = {
      id: crypto.randomUUID(),
			date: convertReadingDateToDate(),
			currentPage: readingCount
		};
		if (bookInfo.pageHistory) {
			bookInfo.pageHistory.push(item);
		} else {
			bookInfo.pageHistory = [item];
		}

		//読んだ記録と現在のステータスが一致しない場合に自動で変更する。
		let toastMessage = '';
		if (bookInfo.status === 'wish' && bookInfo.pageHistory.length === 1) {
			bookInfo.status = 'reading';
			toastMessage = 'ステータスを「読んでいる本」に変更しました。';
		}	else if (bookInfo.status !== 'complete' && readingCount === bookInfo.pageCount) {
			bookInfo.status = 'complete';
			toastMessage = 'ステータスを「読み終わった本」に変更しました。';
		}

		readingDate = setCurrentDate();
		readingCount = 0;
		//追加した記録を反映させるため変更を通知
		bookInfo = bookInfo;

		// //入力値の自動変更があればトーストで通知。
		// if (toastMessage) { pushToast(toastMessage, target); }
	}

	/**StatusがCompleteに変更された際に、最終ページまでの記録が無ければ追加する。 */
	private addCompleteHistory() {
		// if (this.bookInfo.status.value !== 'complete' || this.hasCompleteHistory()) { return; }

		// readingDate = setCurrentDate();
		// readingCount = bookInfo.pageCount;
		// addHistory();

		// pushToast('最後のページまでの読んだ記録を追加しました。', target);
	}

	public changeStatus(status: Status) {
		if (this.status.equals(status)) { return; }
		if (status.value === 'complete') { this.addCompleteHistory(); }

		this.status = status;
	}

	/**最終ページのpageHistoryがあるかを確認する。 */
	public hasCompleteHistory(): boolean {
		if (!this.pageHistories?.length) { return false; }

		let result = false;
		this.pageHistories!.forEach(item => {
			if (item.value.pageCount === this.pageCount) { result = true; }
		})

		return result;
	}
	
  /**pageHistoryの中から最大のページ数を取得する。*/
	public getMaxPageCount(): number {
		return this.pageHistories!.reduce((max, item) => Math.max(max, item.value.pageCount), -Infinity)!;
	}
}

/**書誌情報のEntityを生成するためのプロパティ */
export type bookInfoProperties = {
	id: string,
	userId: string,
	title: string,
	author: string[],
	thumbnail: string,
	createDate: Date,
	updateDate: Date,
	pageCount: number,
	isFavorite: boolean,
	status: status,
	memorandum: string,
	isVisible: boolean,
	completeDate?: Date,
	pageHistories?: pageHistory[],
	identifiers?: identifiers,
	shelfCategories?: ObjectId[],
	gapiId?: string
}

const isBookInfoProperties = (obj: any): obj is bookInfoProperties => {
	return 'userId' in obj;
}

type industryIdentifiers = {
	identifier?: string | undefined;
	type?: string | undefined;
} [] | undefined

/**ISBNを取得する(存在しない場合はundefined) */
const getIdentifier = (identifiers: industryIdentifiers) => {
	const isbn_13 = identifiers?.find(id => id.type === 'ISBN_13')?.identifier;
	if (isbn_13) { return {isbn_13}; }
	
	const isbn_10 = identifiers?.find(id => id.type === 'ISBN_10')?.identifier;
	if (isbn_10) { return {isbn_10}; }

	return undefined;
}