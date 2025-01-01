import type { ObjectId } from 'mongodb';

export interface BookShelfDBModel {
	userId: string;
	shelfName: string;
	contentsIds: ObjectId[];
	createDate: Date;
	updateDate: Date;
	_id?: ObjectId;
}
