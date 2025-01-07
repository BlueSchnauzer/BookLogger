import type { id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';
import type { OrderFilters } from '$lib/client/Feature/Contents/interface';
import type { bookShelvesCollection } from '$lib/server/Shared/Helpers/MongoDBHelper';
import { ObjectId } from 'mongodb';
import type { IBookShelfDBRepositories } from '../IBookShelfDB';
import type { BookShelfDBModel } from './BookShelfModel';

export class BookShelfMongoDBResource implements IBookShelfDBRepositories {
	constructor(
		private readonly _collection: bookShelvesCollection,
		private readonly _userId: UserId
	) {}

	async getBookShelf(id: id): Promise<BookShelfDBModel | undefined> {
		let mongoDBModel: BookShelfDBModel | undefined;

		try {
			mongoDBModel =
				((await this._collection.findOne({
					_id: new ObjectId(id),
					userId: this._userId.value
				})) as BookShelfDBModel) ?? undefined;
		} catch (error) {
			console.log(error);
			console.log('書棚データの取得に失敗しました。');
		}

		return mongoDBModel;
	}

	async getBookShelves(options: { query?: string; order?: OrderFilters }): Promise<{
		lastPageCount: number;
		totalCount: number;
		bookShelfDBModels: BookShelfDBModel[];
	}> {
		throw new Error('Method not implemented.');
	}

	async insert(bookShelf: BookShelfDBModel): Promise<Response> {
		throw new Error('Method not implemented.');
	}

	async update(bookShelf: BookShelfDBModel): Promise<Response> {
		throw new Error('Method not implemented.');
	}

	async delete(id: id): Promise<Response> {
		throw new Error('Method not implemented.');
	}
}
