import type { status } from '$lib/customTypes';
import type { books_v1 } from 'googleapis';
import type { ObjectId } from 'mongodb';
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

	constructor(volume: books_v1.Schema$Volume, userId: string);
	constructor(entity: BookInfoEntity);

	/**GAPIのデータもしくは書誌情報のEntityを用いて初期化する
	 * GAPIのデータを使うので汎用的にはなっていないけど
	 */
	constructor(resource?: books_v1.Schema$Volume | BookInfoEntity, userId?: string){
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
			this.pageHistories = resource.pageHistories?.map(item => item.value);
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
			this.pageHistories = undefined;
			this.identifiers = getIdentifier(resource!.volumeInfo?.industryIdentifiers);
			this.gapiId = resource!.id ?? this.title; //gapi固有の情報なので入れたら微妙な感じではある
		}
	}
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