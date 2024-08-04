import { isBookInfoView, type BookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { IBookInfoModel } from '$lib/client/Domain/Entities/MongoDB/IBookInfoModel';
import { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { Identifiers, type identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import {
	PageHistory,
	type pageHistory
} from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status, type status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import { getCurrentDateString } from '$lib/client/Helpers/Date';
import { getIdentifier } from '$lib/client/Helpers/GoogleBooksAPI';
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
	private _shelfCategories?: ObjectId[];
	private _gapiId?: string;

	get id() {
		return this._id;
	}
	get userId() {
		return this._userId;
	}
	get title() {
		return this._title;
	}
	get author() {
		return this._author;
	}
	get thumbnail() {
		return this._thumbnail;
	}
	get createDate() {
		return this._createDate;
	}
	get updateDate() {
		return this._updateDate;
	}
	get pageCount() {
		return this._pageCount;
	}
	get isFavorite() {
		return this._isFavorite;
	}
	get status() {
		return this._status;
	}
	get memorandum() {
		return this._memorandum;
	}
	get isVisible() {
		return this._isVisible;
	}
	get completeDate() {
		return this._completeDate;
	}
	get pageHistories() {
		return this._pageHistories;
	}
	get identifiers() {
		return this._identifiers;
	}
	get shelfCategories() {
		return this._shelfCategories;
	}
	get gapiId() {
		return this._gapiId;
	}

	set pageCount(pageCount: number) {
		this._pageCount = pageCount;
	}
	set memorandum(memorandum: string) {
		this._memorandum = memorandum;
	}

	constructor(view: BookInfoView);
	constructor(properties: bookInfoProperties);
	constructor(volume: books_v1.Schema$Volume, userId: string);

	/**BookInfoのEntityを生成(MongoDBのモデルを渡して生成する) */
	constructor(
		resource: books_v1.Schema$Volume | bookInfoProperties | BookInfoView,
		userId?: string
	) {
		if (isBookInfoView(resource)) {
			this._id = resource.id;
			this._userId = resource.userId;
			this._title = resource.title;
			this._author = resource.author;
			this._thumbnail = resource.thumbnail;
			this._createDate = resource.createDate;
			this._updateDate = resource.updateDate;
			this._pageCount = resource.pageCount;
			this._isFavorite = resource.isFavorite;
			this._status = resource.status;
			this._memorandum = resource.memorandum;
			this._isVisible = resource.isVisible;
			this._completeDate = resource.completeDate;
			this._pageHistories = resource.pageHistories;
			this._identifiers = resource.identifiers;
			this._gapiId = resource.gapiId;
		} else if (isBookInfoProperties(resource)) {
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
			this._pageHistories = resource.pageHistories
				? resource.pageHistories?.map((item) => new PageHistory(item))
				: [];
			this._identifiers =
				resource.identifiers != undefined ? new Identifiers(resource.identifiers) : undefined;
			this._shelfCategories = resource.shelfCategories;
			this._gapiId = resource.gapiId;
		} else {
			const currentDate = new Date();

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
			this._identifiers = new Identifiers(
				getIdentifier(resource!.volumeInfo?.industryIdentifiers)!
			);
			this._gapiId = resource!.id ?? this._title; //gapi固有の情報なので入れたら微妙な感じではある
		}
	}

	/**MongoDBModelからEntityを生成する */
	public static fromDBModel(mongoDBModel: IBookInfoModel) {
		return new BookInfo({
			id: mongoDBModel._id?.toString()!,
			userId: mongoDBModel.userId,
			title: mongoDBModel.title,
			author: mongoDBModel.author,
			thumbnail: mongoDBModel.thumbnail,
			createDate: mongoDBModel.createDate,
			updateDate: mongoDBModel.updateDate,
			pageCount: mongoDBModel.pageCount,
			isFavorite: mongoDBModel.isFavorite,
			status: mongoDBModel.status,
			memorandum: mongoDBModel.memorandum,
			isVisible: mongoDBModel.isVisible,
			completeDate: mongoDBModel.completeDate,
			pageHistories: mongoDBModel.pageHistories,
			identifiers: mongoDBModel.identifiers,
			shelfCategories: mongoDBModel.shelfCategories,
			gapiId: mongoDBModel.gapiId
		});
	}

	public changeFavorite() {
		this._isFavorite = !this._isFavorite;
	}

	public setStatus(status: Status) {
		if (this._status.equals(status)) {
			return;
		}
		if (status.value === 'complete') {
			this.addCompleteHistory();
		}

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
		if (this.hasCompleteHistory()) {
			return;
		}

		const readingDate = getCurrentDateString();
		const readingCount = this._pageCount;

		this.addPageHistory(new PageHistory({ date: readingDate, pageCount: readingCount }));
	}

	/**最終ページのpageHistoryがあるかを確認する。 */
	private hasCompleteHistory() {
		if (!this._pageHistories?.length) {
			return false;
		}

		let result = false;
		this._pageHistories?.forEach((item) => {
			if (item.value.pageCount === this._pageCount) {
				result = true;
			}
		});

		return result;
	}
}

/**書誌情報のEntityを生成するためのプロパティ */
export type bookInfoProperties = {
	id: string;
	userId: string;
	title: string;
	author: string[];
	thumbnail: string;
	createDate: Date;
	updateDate: Date;
	pageCount: number;
	isFavorite: boolean;
	status: status;
	memorandum: string;
	isVisible: boolean;
	completeDate?: Date;
	pageHistories?: pageHistory[];
	identifiers?: identifiers;
	shelfCategories?: ObjectId[];
	gapiId?: string;
};

const isBookInfoProperties = (obj: any): obj is bookInfoProperties => {
	return 'userId' in obj;
};
