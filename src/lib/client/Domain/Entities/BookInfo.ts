import type { BookInfoDBModel } from '$lib/client/Domain/Entities/MongoDB/BookInfo';
import { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { Identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import type { ObjectId } from 'mongodb';

export interface BookInfo {
	id?: Id;
	userId: UserId;
	title: string;
	author: string[];
	thumbnail: string;
	createDate: Date;
	updateDate: Date;
	pageCount: number;
	isFavorite: boolean;
	status: Status;
	memorandum: string;
	isVisible: boolean;
	completeDate?: Date;
	pageHistories?: PageHistory[];
	identifiers?: Identifiers;
	shelfCategories?: ObjectId[];
	gapiId?: string;
}

export const convertDBModelToBookInfo = (model: BookInfoDBModel): BookInfo => {
	const bookInfo: BookInfo = {
		...model,
		id: new Id(model._id?.toString()!),
		userId: new UserId(model.userId),
		status: new Status(model.status),
		pageHistories: model.pageHistories
			? model.pageHistories?.map((item) => new PageHistory(item))
			: [],
		identifiers: model.identifiers != undefined ? new Identifiers(model.identifiers) : undefined
	};

	return bookInfo;
};
