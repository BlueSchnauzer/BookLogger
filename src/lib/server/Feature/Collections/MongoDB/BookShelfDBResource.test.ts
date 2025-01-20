import { MongoClient, type Db, type Collection, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
	convertBookShelfToDBModel,
	type BookShelfDBModel
} from '$lib/server/Feature/Collections/MongoDB/BookShelfModel';
import { bookShelfInterfaceMock, bookShelfInterfaceMocks, testUserId1 } from '$lib/mock/Data';
import { BookShelfMongoDBResource } from '$lib/server/Feature/Collections/MongoDB/BookShelfDBResource';
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
		const response = await repos.getBookShelves();
		expect(response).toBeDefined();
		expect(response.length).toBe(1);
		expect(response[0].userId).toEqual(testUserId1);
	});
	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const repos = new BookShelfMongoDBResource(collection, new UserId(testUserId1));
		const response = await repos.getBookShelves();
		expect(response).toBeDefined();
		expect(response.length).toBe(0);
	});

	describe('queryもしくはorderの値に一致するデータを取得できること', () => {
		it('query引数の値に部分一致する、shelfNameを持つ書棚情報を取得できること', async () => {
			const testData = bookShelfInterfaceMock;
			const preData = await collection.insertOne(convertBookShelfToDBModel(testData));
			expect(preData.acknowledged).toBeTruthy();

			const repos = new BookShelfMongoDBResource(collection, testData.userId);
			const response = await repos.getBookShelves({ query: testData.shelfName });

			expect(response).toBeDefined();
			expect(response.length).toBe(1);
			expect(response[0].shelfName).toEqual(testData.shelfName);
		});
		it('order引数の条件で、取得するデータの並び替えが行えること。', async () => {
			const testDatas = bookShelfInterfaceMocks;
			//並び替えのために最新化する
			const date = new Date();
			testDatas[0].createDate.setDate(date.getDate() + 1);
			testDatas[1].createDate.setDate(date.getDate() - 1);
			testDatas[2].updateDate.setDate(date.getDate() + 1);

			const preData = await collection.insertMany(
				testDatas.map((data) => convertBookShelfToDBModel(data))
			);
			expect(preData.acknowledged).toBeTruthy();

			const repos = new BookShelfMongoDBResource(collection, testDatas[0].userId);
			const filteredByDesc = await repos.getBookShelves({ order: 'createDateDesc' });
			const filteredByAsc = await repos.getBookShelves({ order: 'createDateAsc' });
			const filteredByUpdateDate = await repos.getBookShelves({ order: 'updateDate' });

			expect(filteredByDesc.length).toBe(3);
			expect(filteredByDesc[0].shelfName).toBe(testDatas[0].shelfName);

			expect(filteredByAsc.length).toBe(3);
			expect(filteredByAsc[0].shelfName).toBe(testDatas[1].shelfName);

			expect(filteredByUpdateDate.length).toBe(3);
			expect(filteredByUpdateDate[0].shelfName).toBe(testDatas[2].shelfName);
		});
		it('queryとorderの組み合わせ条件で、書誌データを取得できること', async () => {
			const testDatas = bookShelfInterfaceMocks;

			testDatas[2].updateDate.setDate(new Date().getDate() + 1);
			const preData = await collection.insertMany(
				testDatas.map((data) => convertBookShelfToDBModel(data))
			);
			expect(preData.acknowledged).toBeTruthy();

			const repos = new BookShelfMongoDBResource(collection, testDatas[0].userId);
			const filteredByConditions = await repos.getBookShelves({
				query: 'test',
				order: 'updateDate'
			});

			expect(filteredByConditions.length).toBe(3);
			expect(filteredByConditions[0].shelfName).toBe(testDatas[2].shelfName);
		});
	});
});

describe('insert', () => {
	it('書棚情報を保存できること', async () => {
		const testData = bookShelfInterfaceMock;
		const repos = new BookShelfMongoDBResource(collection, testData.userId);
		const response = await repos.insert(convertBookShelfToDBModel(testData));

		expect(response).toBeDefined();
		expect(response.status).toBe(201);
	});
});

describe('update', () => {
	it('書棚情報を更新できること', async () => {
		const testData = bookShelfInterfaceMock;
		const preData = await collection.insertOne(convertBookShelfToDBModel(testData));
		expect(preData.acknowledged).toBeTruthy();

		const repos = new BookShelfMongoDBResource(collection, testData.userId);
		const response = await repos.update(convertBookShelfToDBModel(testData));

		expect(response).toBeDefined();
		expect(response.status).toBe(200);
	});
	it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
		const testData = bookShelfInterfaceMock;
		const repos = new BookShelfMongoDBResource(collection, testData.userId);
		const response = await repos.update(convertBookShelfToDBModel(testData));

		expect(response).toBeDefined();
		expect(response.status).toBe(400);
	});
});

describe('delete', () => {
	it('書棚情報を削除できること', async () => {
		const testData = bookShelfInterfaceMock;
		const preData = await collection.insertOne(convertBookShelfToDBModel(testData));
		expect(preData.acknowledged).toBeTruthy();

		const repos = new BookShelfMongoDBResource(collection, testData.userId);
		const response = await repos.delete(testData.id?.value!);

		expect(response).toBeDefined();
		expect(response.status).toBe(200);
	});
	it('削除対象が見つからない場合にエラーステータスが返ってくること', async () => {
		const repos = new BookShelfMongoDBResource(collection, new UserId(testUserId1));
		const response = await repos.delete(new ObjectId().toHexString());

		expect(response).toBeDefined();
		expect(response.status).toBe(400);
	});
});
