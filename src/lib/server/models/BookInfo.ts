import { ObjectId } from 'mongodb';
import { Schema, model } from 'mongoose';

/**書誌情報 */
export interface IBookInfo {
	//userId: ObjectId; //User用のスキーマが完成した際に入れ替える。
	userId: number;
	isbn_13: string;
	title: string;
	imageUrl: string;
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
	isVisible: boolean; //DBでは管理しない
	isbn_10?: string;
}

const bookInfoSchema = new Schema<IBookInfo>({
	//userId: { type: ObjectId, required: true, ref: User }, //User用のモデルが完成した際に入れ替える。
	userId: {type: Number, required: true},
	isbn_13: { type: String, required: true },
	title: { type: String, required: true },
	imageUrl: { type: String, default: '' },
	createDate: { type: Date, required: true },
	updateDate: { type: Date, required: true },
	pageCount: { type: Number, default: -1 },
	history: [
		{
			required: false,
			date: { type: Date, required: true },
			currentPage: { type: Number, required: true }
		}
	],
	isCompleted: { type: Boolean, required: true },
    isFavorite: { type: Boolean, required: true, default: false},
	memorandum: { type: String, default: '' },
	isbn_10: { type: String, default: '' }
});

/**書誌情報のモデル */
export const BookInfoModel = model<IBookInfo>('BookInfo', bookInfoSchema);
