import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status, type status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { Id } from '$lib/server/Domain/ValueObjects/BookInfo/Id';
import { PageHistory, type pageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers, type identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import type MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import type { books_v1 } from 'googleapis';

/**書誌情報のEntity */
export class BookInfo {
	private _id?: Id;
	private _userId: UserId;
	private _title: string;
	private _author: string[];
	private _thumbnail: string;
	private _createDate: Date;
	private _updateDate: Date;
	private _pageCount: number;
	private _isFavorite: boolean;
	private _status: Status;
	private _memorandum: string;
	private _isVisible: boolean;
	private _completeDate?: Date;
	private _pageHistories?: PageHistory[];
	private _identifiers?: Identifiers;
	private _shelfCategories?: ObjectId[]
	private _gapiId?: string;

	public getId() { return this._id; }
	public getUserId() { return this._userId; }
	public getTitle() { return this._title; }
	public getAuthor() { return this._author; }
	public getThumbnail() { return this._thumbnail; }
	public getCreateDate() { return this._createDate; }
	public getUpdateDate() { return this._updateDate; }
	public getPageCount() { return this._pageCount; }
	public getIsFavorite() { return this._isFavorite; }
	public getStatus() { return this._status; }
	public getMemorandum() { return this._memorandum; }
	public getIsVisible() { return this._isVisible; }
	public getCompleteDate() { return this._completeDate; }
	public getPageHistories() { return this._pageHistories; }
	public getIdentifiers() { return this._identifiers; }
	public getShelfCategories() { return this._shelfCategories; }
	public getGapiId() { return this._gapiId; }

	constructor(volume: books_v1.Schema$Volume, userId: string);
	constructor(properties: bookInfoProperties);

	/**BookInfoのEntityを生成(MongoDBのモデルを渡して生成する) */
	constructor(resource: bookInfoProperties | books_v1.Schema$Volume, userId?: string) {
		if (isBookInfoProperties(resource)) {
			this._id = new Id(resource.id);
			this._userId = new UserId(resource.userId);
			this._title = resource.title;
			this._author = resource.author;
			this._thumbnail = resource.thumbnail;
			this._createDate = resource.createDate;
			this._updateDate = resource.updateDate;
			this._pageCount = resource.pageCount;
			this._isFavorite = resource.isFavorite;
			this._status = new Status(resource.status);
			this._memorandum = resource.memorandum;
			this._isVisible = resource.isVisible;
			this._completeDate = resource.completeDate;
			this._pageHistories = resource.pageHistories ? resource.pageHistories?.map(item => new PageHistory(item)) : [];
			this._identifiers = resource.identifiers != undefined ? new Identifiers(resource.identifiers) : undefined;
			this._shelfCategories = resource.shelfCategories;
			this._gapiId = resource.gapiId;
		}
		else {
			const currentDate = new Date;

			this._userId = new UserId(userId!);
			this._title = resource!.volumeInfo?.title ?? '';
			this._author = resource!.volumeInfo?.authors ?? [''];
			this._thumbnail = resource!.volumeInfo?.imageLinks?.thumbnail ?? ''; //gapi固有の情報だが、画像そのものではなく場所を表すURLを保存する。
			this._createDate = currentDate;
			this._updateDate = currentDate;
			this._pageCount = resource!.volumeInfo?.pageCount ?? 0;
			this._isFavorite = false;
			this._status = new Status('wish');
			this._memorandum = '';
			this._isVisible = true;
			this._pageHistories = [];
			this._identifiers = new Identifiers(getIdentifier(resource!.volumeInfo?.industryIdentifiers)!);
			this._gapiId = resource!.id ?? this._title; //gapi固有の情報なので入れたら微妙な感じではある
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

	public setPageCount(pageCount: number) {
		this._pageCount = pageCount;
	}

	public changeFavorite() {
		this._isFavorite = !this._isFavorite;
	}

	public setStatus(status: Status) {
		if (this._status.equals(status)) { return; }
		if (status.value === 'complete') { this.addCompleteHistory(); }

		this._status = status;
	}

	public setMemorandum(memorandum: string) {
		this._memorandum = memorandum;
	}

	public addPageHistory(item: PageHistory) {
		if (this._pageHistories) {
			this._pageHistories.push(item);
		} else {
			this._pageHistories = [item];
		}	
	}	

	/**StatusがCompleteに変更された際に、最終ページまでの記録が無ければ追加する。 */
	private addCompleteHistory() {
		if (this.hasCompleteHistory()) { return; }

		const readingDate = setCurrentDate();
		const readingCount = this._pageCount;

		this.addPageHistory(new PageHistory({ date: readingDate, pageCount: readingCount }));
	}

	/**最終ページのpageHistoryがあるかを確認する。 */
	public hasCompleteHistory() {
		if (!this._pageHistories?.length) { return false; }

		let result = false;
		this._pageHistories?.forEach(item => {
			if (item.value.pageCount === this._pageCount) {
				result = true;
			}
		})

		return result;
	}

	/**pageHistoryの中から最大のページ数を取得する。*/
	public getMaxPageCountFromHistory(): number | undefined {
		if (!this._pageHistories?.length) { return undefined; }
		return this._pageHistories?.reduce((max, item) => Math.max(max, item.value.pageCount), -Infinity)!;
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

const setCurrentDate = () => {
	const date = new Date();
	return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
}

const isBookInfoProperties = (obj: any): obj is bookInfoProperties => {
	return 'userId' in obj;
}

type industryIdentifiers = {
	identifier?: string | undefined;
	type?: string | undefined;
}[] | undefined

/**ISBNを取得する(存在しない場合はundefined) */
const getIdentifier = (identifiers: industryIdentifiers) => {
	const isbn_13 = identifiers?.find(id => id.type === 'ISBN_13')?.identifier;
	if (isbn_13) { return { isbn_13 }; }

	const isbn_10 = identifiers?.find(id => id.type === 'ISBN_10')?.identifier;
	if (isbn_10) { return { isbn_10 }; }

	return undefined;
}