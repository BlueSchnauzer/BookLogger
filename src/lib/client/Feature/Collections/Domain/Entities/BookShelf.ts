import { Id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';
import type { BookShelfDBModel } from '$lib/server/Feature/Collections/MongoDB/BookShelfModel';

export interface BookShelf {
	id?: Id;
	userId: UserId;
	shelfName: string;
	contentsIds: Id[];
	createDate: Date;
	updateDate: Date;
}

export const convertDBModelToBookShelf = (model: BookShelfDBModel): BookShelf => {
	const bookShelf: BookShelf = {
		...model,
		id: new Id(model._id?.toString()!),
		userId: new UserId(model.userId),
		contentsIds: model.contentsIds.map((id) => new Id(id.toString()))
	};

	return bookShelf;
};
