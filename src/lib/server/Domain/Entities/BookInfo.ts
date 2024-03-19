import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status, type status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { PageHistory, type pageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers, type identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';

/**書誌情報 */
export class BookInfo {
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
	public id?: ObjectId;
	public completeDate?: Date;
	public pageHistories?: PageHistory[];
	public identifiers?: Identifiers[];
	public shelfCategories?: ObjectId[]
	public gapiId?: string;

	//MongoDBのモデルをそのまま渡して、内部でプロパティを参照するように修正する。
	constructor(userId: string, title: string, author: string[], thumbnail: string, createDate: Date, updateDate: Date,
		pageCount: number, isFavorite: boolean, status: status, memorandum: string, isVisible: boolean,
		_id?: ObjectId, completeDate?: Date, pageHistories?: pageHistory[], identifiers?: identifiers[], shelfCategories?: ObjectId[], gapiId?: string) {
		this.userId = new UserId(userId);
		this.title = title;
		this.author = author;
		this.thumbnail = thumbnail;
		this.createDate = createDate;
		this.updateDate = updateDate;
		this.pageCount = pageCount;
		this.isFavorite = isFavorite;
		this.status = new Status(status);
		this.memorandum = memorandum;
		this.isVisible = isVisible;
		this.id = _id;
		this.completeDate = completeDate;
		this.pageHistories = pageHistories?.map(item => new PageHistory(item));
		this.identifiers = identifiers?.map(item => new Identifiers(item));
		this.shelfCategories = shelfCategories;
		this.gapiId = gapiId;
	}
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