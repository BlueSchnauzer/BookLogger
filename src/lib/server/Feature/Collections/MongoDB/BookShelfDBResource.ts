import type { id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';
import type { OrderFilters } from '$lib/client/Feature/Contents/interface';
import type { bookShelvesCollection } from '$lib/server/Shared/Helpers/MongoDBHelper';
import { ObjectId, type Filter, type SortDirection } from 'mongodb';
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

	async getBookShelves(options: {
		query?: string;
		order?: OrderFilters;
	}): Promise<BookShelfDBModel[]> {
		let mongoDBModels: BookShelfDBModel[] = [];

		const { filters, sort } = this.getFilterAndSortConditions(options);

		try {
			mongoDBModels = (await this._collection
				.find(filters)
				.sort(sort)
				.toArray()) as BookShelfDBModel[];
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');
		}

		return mongoDBModels;
	}

	private getFilterAndSortConditions = (options?: { query?: string; order?: string }) => {
		const filters: Filter<BookShelfDBModel> = { $and: [{ userId: this._userId.value }] };
		if (options?.query) {
			filters.$and?.push({
				$or: [
					{ title: { $regex: options.query, $options: 'i' } },
					{ author: { $regex: options.query, $options: 'i' } }
				]
			});
		}

		let sort: { [key in keyof BookShelfDBModel]?: SortDirection } = { createDate: -1 };
		if (options?.order) {
			switch (options.order) {
				case 'createDateAsc':
					sort = { createDate: 1 };
					break;
				case 'updateDate':
					sort = { updateDate: -1 };
					break;
				case 'createDateDesc':
				default:
					break;
			}
		}

		return { filters, sort };
	};

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
