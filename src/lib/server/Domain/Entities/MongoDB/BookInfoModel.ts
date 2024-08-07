import { type BookInfo } from '$lib/client/Domain/Entities/BookInfo';
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
export interface BookInfoDBModel {
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
	_id?: ObjectId;
	completeDate?: Date;
	pageHistories?: pageHistory[];
	identifiers?: identifiers;
	shelfCategories?: ObjectId[];
	gapiId?: string;
}

export const convertGAPIResposeToDBModel = (userId: string, response: books_v1.Schema$Volume) => {
	const currentDate = new Date();

	const dbModel: BookInfoDBModel = {
		userId: userId!,
		title: response!.volumeInfo?.title ?? '',
		author: response!.volumeInfo?.authors ?? [''],
		thumbnail: response!.volumeInfo?.imageLinks?.thumbnail ?? '', //gapi固有の情報だが、画像そのものではなく場所を表すURLを保存する。
		createDate: currentDate,
		updateDate: currentDate,
		pageCount: response!.volumeInfo?.pageCount ?? 0,
		status: 'wish',
		isFavorite: false,
		memorandum: '',
		isVisible: true,
		identifiers: getIdentifier(response!.volumeInfo?.industryIdentifiers),
		gapiId: response!.id ?? '' //gapi固有の情報なので入れたら微妙な感じではある
	};

	return dbModel;
};

export const convertEntityToDBModel = (entity: BookInfo) => {
	const dbModel: BookInfoDBModel = {
		userId: entity.userId.value,
		title: entity.title,
		author: entity.author,
		thumbnail: entity.thumbnail,
		createDate: entity.createDate,
		updateDate: entity.updateDate,
		pageCount: entity.pageCount,
		status: entity.status.value,
		isFavorite: entity.isFavorite,
		memorandum: entity.memorandum,
		isVisible: entity.isVisible,
		_id: entity.id ? new ObjectId(entity.id?.value) : undefined,
		pageHistories: entity.pageHistories ? entity.pageHistories?.map((item) => item.value) : [],
		identifiers: entity.identifiers?.value,
		gapiId: entity.gapiId
	};

	return dbModel;
};
