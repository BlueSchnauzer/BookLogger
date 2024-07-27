import { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { Identifiers, type identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import { PageHistory, type pageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status, type status } from "$lib/client/Domain/ValueObjects/BookInfo/Status";
import { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import { getIdentifier } from '$lib/client/Helpers/GoogleBooksAPI';
import type MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import type { books_v1 } from 'googleapis';
import type { ObjectId } from 'mongodb';

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

	get id() { return this._id; }
	get userId() { return this._userId; }
	get title() { return this._title; }
	get author() { return this._author; }
	get thumbnail() { return this._thumbnail; }
	get createDate() { return this._createDate; }
	get updateDate() { return this._updateDate; }
	get pageCount() { return this._pageCount; }
	get isFavorite() { return this._isFavorite; }
	get status() { return this._status; }
	get memorandum() { return this._memorandum; }
	get isVisible() { return this._isVisible; }
	get completeDate() { return this._completeDate; }
	get pageHistories() { return this._pageHistories; }
	get identifiers() { return this._identifiers; }
	get shelfCategories() { return this._shelfCategories; }
	get gapiId() { return this._gapiId; }

	set pageCount(pageCount: number) { this._pageCount = pageCount; }
	set memorandum(memorandum: string) { this._memorandum = memorandum; }

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

	public changeFavorite() {
		this._isFavorite = !this._isFavorite;
	}

	public setStatus(status: Status) {
		if (this._status.equals(status)) { return; }
		if (status.value === 'complete') { this.addCompleteHistory(); }

		this._status = status;
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
	private hasCompleteHistory() {
		if (!this._pageHistories?.length) { return false; }

		let result = false;
		this._pageHistories?.forEach(item => {
			if (item.value.pageCount === this._pageCount) {
				result = true;
			}
		})

		return result;
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