import { type IBookInfoModel } from '$lib/client/Domain/Entities/MongoDB/IBookInfoModel';
import { BookInfo as BookInfoEntity } from '$lib/client/Domain/Entities/BookInfo';
import type { identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import type { pageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { getIdentifier } from '$lib/client/Helpers/GoogleBooksAPI';
import type { books_v1 } from 'googleapis';
import { ObjectId } from 'mongodb';

/**MongoDB内での書誌情報
 * SQLを経由しないので、
 * MongoDBのモデルに一致するクラスを作って、取得や保存時にはこのクラスを経由するようにする。
 */
export default class BookInfoModel implements IBookInfoModel {
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

	constructor(volume: books_v1.Schema$Volume, userId: string);
	constructor(entity: BookInfoEntity);

	/**GAPIのデータもしくは書誌情報のEntityを用いて初期化する
	 * GAPIのデータを使うので汎用的にはなっていないけど
	 */
	constructor(resource?: books_v1.Schema$Volume | BookInfoEntity, userId?: string) {
		if (resource instanceof BookInfoEntity) {
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
			this._id = resource.id ? new ObjectId(resource.id?.value) : undefined;
			this.pageHistories = resource.pageHistories ? resource.pageHistories?.map(item => item.value) : [];
			this.identifiers = resource.identifiers?.value;
			this.gapiId = resource.gapiId;
		}
		else {
			const currentDate = new Date;

			this.userId = userId!;
			this.title = resource!.volumeInfo?.title ?? '';
			this.author = resource!.volumeInfo?.authors ?? [''];
			this.thumbnail = resource!.volumeInfo?.imageLinks?.thumbnail ?? ''; //gapi固有の情報だが、画像そのものではなく場所を表すURLを保存する。
			this.createDate = currentDate;
			this.updateDate = currentDate;
			this.pageCount = resource!.volumeInfo?.pageCount ?? 0;
			this.status = 'wish';
			this.isFavorite = false;
			this.memorandum = '';
			this.isVisible = true;
			this.identifiers = getIdentifier(resource!.volumeInfo?.industryIdentifiers);
			this.gapiId = resource!.id ?? this.title; //gapi固有の情報なので入れたら微妙な感じではある
		}
	}
}