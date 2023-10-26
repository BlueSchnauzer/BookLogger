import type { books_v1 } from 'googleapis';
import type { ObjectId } from 'mongodb';

/**書誌情報 */
export class BookInfo {
	public userId: number;
	public title: string;
	//userId: ObjectId; //User用のスキーマが完成した際に入れ替える。
	public author: string[];
	public thumbnail: string;
	public createDate: Date;
	public pageCount: number;
	public history: [
		{
			date: Date;
			currentPage: number;
		}
	];
	public isCompleted: boolean;
	public isFavorite: boolean;
	public memorandum: string;
	public isVisible: boolean;
	public _id?: ObjectId;
	public identifier?: {
		isbn_13?: string;
		isbn_10?: string;
	};
	public updateDate?: Date;
	public shelfCategory?: ObjectId[];

	/**GAPIのvolumeで初期化する */
	constructor(volume: books_v1.Schema$Volume, userId: number){
		this.userId = userId;
		this.title = volume.volumeInfo?.title ?? '';
		this.author = volume.volumeInfo?.authors ?? [''];
		this.thumbnail = ''; //gapi固有の情報なので、保存しないで都度取る。
		this.createDate = new Date;
		this.pageCount = volume.volumeInfo?.pageCount ?? -1;
		this.history = [
			{
				date: new Date,
				currentPage: 0
			}
		];
		this.isCompleted = false;
		this.isFavorite = false;
		this.memorandum = '';
		this.isVisible = true;
		this.identifier = getIdentifier(volume.volumeInfo?.industryIdentifiers);
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