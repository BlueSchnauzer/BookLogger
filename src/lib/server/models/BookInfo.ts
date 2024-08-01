import type { status } from '$lib/customTypes';
import type { books_v1 } from 'googleapis';
import type { ObjectId } from 'mongodb';

/**書誌情報 */
export class BookInfo {
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
	public pageHistory?: {
		id: string;
		date: Date;
		currentPage: number;
	}[];
	public identifier?: {
		isbn_13?: string;
		isbn_10?: string;
	};
	public shelfCategory?: ObjectId[];
	public gapiId?: string;

	/**GAPIのvolumeで初期化する */
	constructor(volume: books_v1.Schema$Volume, userId: string) {
		const currentDate = new Date();

		this.userId = userId;
		this.title = volume.volumeInfo?.title ?? '';
		this.author = volume.volumeInfo?.authors ?? [''];
		this.thumbnail = volume.volumeInfo?.imageLinks?.thumbnail ?? ''; //gapi固有の情報だが、画像そのものではなく場所を表すURLを保存する。
		this.createDate = currentDate;
		this.updateDate = currentDate;
		this.pageCount = volume.volumeInfo?.pageCount ?? 0;
		this.status = 'wish';
		this.isFavorite = false;
		this.memorandum = '';
		this.isVisible = true;
		this.identifier = getIdentifier(volume.volumeInfo?.industryIdentifiers);
		this.gapiId = volume.id ?? this.title; //gapi固有の情報なので入れたら微妙な感じではある
	}
}

type industryIdentifiers =
	| {
			identifier?: string | undefined;
			type?: string | undefined;
	  }[]
	| undefined;

/**ISBNを取得する(存在しない場合はundefined) */
const getIdentifier = (identifiers: industryIdentifiers) => {
	const isbn_13 = identifiers?.find((id) => id.type === 'ISBN_13')?.identifier;
	if (isbn_13) {
		return { isbn_13 };
	}

	const isbn_10 = identifiers?.find((id) => id.type === 'ISBN_10')?.identifier;
	if (isbn_10) {
		return { isbn_10 };
	}

	return undefined;
};
