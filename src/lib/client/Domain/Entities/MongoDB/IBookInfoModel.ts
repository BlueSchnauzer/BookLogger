import type { identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import type { pageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { ObjectId } from 'mongodb';

export interface IBookInfoModel {
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
	shelfCategories?: ObjectId[]
	gapiId?: string;
}