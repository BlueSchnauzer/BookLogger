import type { BookShelf } from '$lib/client/Feature/Collections/Domain/Entities/BookShelf';
import { ObjectId } from 'mongodb';

export interface BookShelfDBModel {
	userId: string;
	shelfName: string;
	contentsIds: ObjectId[];
	createDate: Date;
	updateDate: Date;
	_id?: ObjectId;
}

export const convertBookShelfToDBModel = (entity: BookShelf): BookShelfDBModel => {
	const dbModel: BookShelfDBModel = {
		userId: entity.userId.value,
		shelfName: entity.shelfName,
		contentsIds: entity.contentsIds.map((id) => new ObjectId(id.value)),
		createDate: entity.createDate,
		updateDate: entity.updateDate,
		_id: entity.id ? new ObjectId(entity.id?.value) : undefined
	};

	return dbModel;
};
