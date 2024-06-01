import type { status } from '$lib/customTypes';
import type { books_v1 } from 'googleapis';
import { ObjectId } from 'mongodb';
import type { pageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import type { identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import { BookInfo as BookInfoEntity } from '$lib/server/Domain/Entities/BookInfo';

/**MongoDB内での書誌情報
 * SQLを経由しないので、
 * MongoDBのモデルに一致するクラスを作って、取得や保存時にはこのクラスを経由するようにする。
 */
export default class BookInfoMongoDBModel {
	public userId: string;
	public title: string;
	public author: string[];
	public thumbnail: string;
	public createDate: Date;
	public updateDate: Date;
	public pageCount: number;
	public isFavorite: boolean;
	public status: status;
	public memorandum: string;
	public isVisible: boolean;
	public _id?: ObjectId;
	public completeDate?: Date;
	public pageHistories?: pageHistory[];
	public identifiers?: identifiers;
	public shelfCategories?: ObjectId[]
	public gapiId?: string;

	constructor(entity: BookInfoEntity);

	/**GAPIのデータもしくは書誌情報のEntityを用いて初期化する
	 * GAPIのデータを使うので汎用的にはなっていないけど
	 */
	constructor(resource: BookInfoEntity) {
		this.userId = resource.userId.value;
		this.title = resource.title;
		this.author = resource.author;
		this.thumbnail = resource.thumbnail;
		this.createDate = resource.createDate;
		this.updateDate = resource.updateDate;
		this.pageCount = resource.pageCount;
		this.status = resource.status.value;
		this.isFavorite = resource.isFavorite;
		this.memorandum = resource.memorandum;
		this.isVisible = resource.isVisible;
		this._id = resource.id ? new ObjectId(resource.id.value) : undefined;
		this.pageHistories = resource.pageHistories ? resource.pageHistories?.map(item => item.value) : [];
		this.identifiers = resource.identifiers?.value;
		this.gapiId = resource.gapiId;
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