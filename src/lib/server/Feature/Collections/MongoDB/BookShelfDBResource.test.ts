import { MongoClient, type Db, type Collection, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	convertBookShelfToDBModel,
	type BookShelfDBModel
} from '$lib/server/Feature/Collections/MongoDB/BookShelfModel';
import { bookShelfInterfaceMock, testUserId1 } from '$lib/mock/Data';
import { BookShelfMongoDBResource } from './BookShelfDBResource';
import { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';

//共通で使用する接続データと、その初期化・破棄用の処理
let client: MongoClient;
let mongoServer: MongoMemoryServer;
let db: Db;
let collection: Collection<BookShelfDBModel>;

beforeEach(async () => {
	mongoServer = await MongoMemoryServer.create();
	client = await MongoClient.connect(mongoServer.getUri(), {});
	db = client.db(mongoServer.instanceInfo?.dbName);
	collection = db.collection<BookShelfDBModel>(env.BOOKSHELVES_COLLECTION_NAME);
});
afterEach(async () => {
	if (client) {
		await client.close();
	}
	if (mongoServer) {
		await mongoServer.stop();
	}
});

describe('getBookShelf', () => {
	it('ユーザIDとIDに一致するデータを取得できること', async () => {
		const testData = bookShelfInterfaceMock;
		const preData = await collection.insertOne(convertBookShelfToDBModel(testData));
		expect(preData.acknowledged).toBeTruthy();

		const repos = new BookShelfMongoDBResource(collection, testData.userId);
		const response = await repos.getBookShelf(testData.id?.value!);

		expect(response).toBeDefined();
		expect(response?.userId).toEqual(testData.userId.value);
		expect(response?.shelfName).toEqual(testData.shelfName);
		expect(response?.contentsIds).toEqual(testData.contentsIds.map((id) => new ObjectId(id.value)));
	});

	it('一致するデータが無い時にUndefinedが返ること', async () => {
		const repos = new BookShelfMongoDBResource(collection, new UserId(testUserId1));
		const response = await repos.getBookShelf(new ObjectId().toHexString());

		expect(response).toBeUndefined();
	});
});

describe('getBookShelves', () => {
	it('ユーザIDに一致するデータを取得できること', async () => {
		const testData = bookShelfInterfaceMock;
		const preData = await collection.insertOne(convertBookShelfToDBModel(testData));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookShelfMongoDBResource(collection, new UserId(testUserId1));
		const response = await repos.getBookShelves({});
		expect(response).toBeDefined();
		expect(response.length).toBe(1);
		expect(response[0].userId).toEqual(testUserId1);
	});
	it('一致するデータが無い場合に空のデータが返ること', () => {});

	describe('queryもしくはorderの値に一致するデータを取得できること', () => {
		it('query引数の値に部分一致する、shelfNameを持つ書棚情報を取得できること', () => {});
		it('order引数の条件で、取得するデータの並び替えが行えること。', () => {});
		it('queryとorderの組み合わせ条件で、書誌データを取得できること', () => {});
	});
});

describe('insert', () => {
	it('書棚情報を保存できること', () => {});
	it('データが不正(同じ_idで作成済み)な場合にエラーステータスが返ってくること', () => {});
});

describe('update', () => {
	it('書棚情報を更新できること', () => {});
	it('更新対象が見つからない場合にエラーステータスが返ってくること', () => {});
});

describe('delete', () => {
	it('書棚情報を削除できること', () => {});
	it('削除対象が見つからない場合にエラーステータスが返ってくること', () => {});
});
