import type { ObjectId } from 'mongodb';

/**書誌情報 */
export type BookInfo = {
	_id: ObjectId;
	//userId: ObjectId; //User用のスキーマが完成した際に入れ替える。
	userId: number;
	isbn_13: string;
	title: string;
	author: string[];
	thumbnail: string;
	createDate: Date;
	updateDate: Date;
	pageCount: number;
	history: [
		{
			date: Date;
			currentPage: number;
		}
	];
	isCompleted: boolean;
	isFavorite: boolean;
	memorandum: string;
	isVisible: boolean;
	shelfCategory?: ObjectId[];
	isbn_10?: string;
}