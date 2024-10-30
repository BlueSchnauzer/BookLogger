import type { id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { pageHistory } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import type { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';
import type { BookInfoDBModel } from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';
import type { IBookInfoDBRepositories } from '$lib/server/Feature/Contents/IBookInfoDB';
import type { bookInfosCollection } from '$lib/server/Feature/Contents/MongoDB/MongoDBHelper';
import { ObjectId, type Filter, type UpdateFilter } from 'mongodb';

/**MongoDBでの書誌データ操作を管理する */
export class BookInfoMongoDBResource implements IBookInfoDBRepositories {
	/**
	 * MongoDB接続用コンストラクタ
	 * @param collection MongoDBのBookInfoコレクションへの接続情報
	 * @param userId 操作対象のUserId
	 */
	constructor(
		private readonly _collection: bookInfosCollection,
		private readonly _userId: UserId
	) {}

	async getBookInfo(id: id): Promise<BookInfoDBModel | undefined> {
		let mongoDBModel: BookInfoDBModel | undefined;

		try {
			const cursor = await this._collection
				.find({ userId: this._userId.value, _id: new ObjectId(id) })
				.limit(1);
			mongoDBModel = (await cursor.hasNext())
				? ((await cursor.next()) as BookInfoDBModel)
				: undefined;
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');
		}

		return mongoDBModel;
	}

	async getBookInfos(
		page: number
	): Promise<{ totalCount: number; bookInfoDBModels: BookInfoDBModel[] }> {
		//これ取れなかったらちゃんとエラーを投げるようにしないとダメだ

		if (page < 0) {
			return { totalCount: 0, bookInfoDBModels: [] };
		}

		let totalCount = 0;
		let mongoDBModels: BookInfoDBModel[] = [];
		const filter = { userId: this._userId.value };

		try {
			const { limit, skip } = this.getLimitAndSkipCount(page);

			totalCount = await this._collection.countDocuments(filter);
			mongoDBModels = (await this._collection
				.find(filter)
				.skip(skip)
				.limit(limit)
				.toArray()) as BookInfoDBModel[];
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');
		}

		return { totalCount, bookInfoDBModels: mongoDBModels };
	}

	async getBookInfosByStatus(
		page: number,
		status: status
	): Promise<{ totalCount: number; bookInfoDBModels: BookInfoDBModel[] }> {
		if (page < 0) {
			return { totalCount: 0, bookInfoDBModels: [] };
		}

		let totalCount = 0;
		let mongoDBModels: BookInfoDBModel[] = [];

		try {
			const { limit, skip } = this.getLimitAndSkipCount(page);

			const filter: Filter<BookInfoDBModel> = {
				$and: [{ userId: this._userId.value }, { status: status }]
			};
			totalCount = await this._collection.countDocuments(filter);
			mongoDBModels = (await this._collection
				.find(filter)
				.skip(skip)
				.limit(limit)
				.toArray()) as BookInfoDBModel[];
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');
		}

		return { totalCount, bookInfoDBModels: mongoDBModels };
	}

	async getRecentBookInfo(): Promise<BookInfoDBModel | undefined> {
		let mongoDBModel: BookInfoDBModel | undefined;

		try {
			//pageHistoryが0より大きいデータを、更新日を降順にしてから、1個だけ取る
			const cursor = await this._collection
				.find({
					userId: this._userId.value,
					'pageHistories.0': { $exists: true }
				})
				.sort({ updateDate: -1 })
				.limit(1);
			mongoDBModel = (await cursor.hasNext())
				? ((await cursor.next()) as BookInfoDBModel)
				: undefined;
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');
		}

		return mongoDBModel;
	}

	async getPageHistory(): Promise<Array<pageHistory[]>> {
		let histories: Array<{ pageHistories: pageHistory[] }> = [];

		try {
			//pageHistoriesのみを取得(_idは指定無しでも取れるので、取らないように明示する)
			const projection = { _id: 0, pageHistories: 1 };
			histories = (await this._collection
				.find({ userId: this._userId.value })
				.project(projection)
				.toArray()) as Array<{ pageHistories: pageHistory[] }>;
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');
		}

		return histories.map((item) => item.pageHistories);
	}

	async insert(bookInfo: BookInfoDBModel): Promise<Response> {
		let response = new Response('書誌データの作成に失敗しました。', { status: 400 });
		if (await this.isDuplicate(bookInfo.gapiId!)) {
			return new Response('登録済みの書誌データです。', { status: 409 }); //409conflict
		}

		try {
			const result = await this._collection?.insertOne(bookInfo);
			if (result?.acknowledged) {
				response = new Response('書誌データの作成に成功しました。', { status: 201 });
			}
		} catch (error) {
			console.log(error);
			response = new Response('書誌データの作成に失敗しました。', { status: 500 });
		}

		return response;
	}

	async update(bookInfo: BookInfoDBModel, isCompleteReading: boolean): Promise<Response> {
		let response = new Response('書誌データの更新に失敗しました。', { status: 400 });

		try {
			//読み終わっている場合のみcompleteDateを更新対象にする
			//($currentDateがreadOnlyかつ、falseを設定できないので事前に分岐させて処理)
			let updateFilter;
			if (isCompleteReading) {
				updateFilter = {
					$currentDate: {
						updateDate: true,
						completeDate: true
					}
				} as UpdateFilter<BookInfoDBModel>;
			} else {
				updateFilter = {
					$currentDate: {
						updateDate: true
					}
				} as UpdateFilter<BookInfoDBModel>;
			}

			//(日付以外は)以下の項目のみ更新
			updateFilter.$set = {
				isFavorite: bookInfo.isFavorite,
				pageCount: bookInfo.pageCount,
				status: bookInfo.status,
				pageHistories: bookInfo.pageHistories,
				memorandum: bookInfo.memorandum
			};

			const result = await this._collection.updateOne(
				{ _id: new ObjectId(bookInfo._id) },
				updateFilter
			);

			if (result?.matchedCount === 0) {
				return response;
			} else if (result?.acknowledged) {
				response = new Response('書誌データの更新に成功しました。', { status: 200 });
			}
		} catch (error) {
			console.log(error);
			response = new Response('書誌データの更新に失敗しました。', { status: 500 });
		}

		return response;
	}

	async delete(id: id): Promise<Response> {
		let response = new Response('書誌データの削除に失敗しました。', { status: 400 });

		try {
			const result = await this._collection.deleteOne({ _id: new ObjectId(id) });
			if (result && result.deletedCount) {
				response = new Response('書誌データの削除に成功しました。', { status: 202 });
			} else if (!result || !result.deletedCount) {
				return response;
			}
		} catch (error) {
			console.log(error);
			response = new Response('書誌データの削除に失敗しました。', { status: 500 });
		}

		return response;
	}

	async isDuplicate(keyId: string): Promise<boolean> {
		let isDuplicate = false;

		try {
			const mongoDBModel = (await this._collection
				.find({ userId: this._userId.value, gapiId: keyId })
				.toArray()) as BookInfoDBModel[];
			isDuplicate = mongoDBModel.length === 0 ? false : true;
		} catch (error) {
			console.log(error);
			console.log('書誌データの取得に失敗しました。');

			throw error;
		}

		return isDuplicate;
	}

	private getLimitAndSkipCount = (page: number) => {
		const limit = 30;
		const skip = page * limit;

		return { limit, skip };
	};
}
