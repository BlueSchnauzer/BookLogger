import * as env from '$env/static/private';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import BookInfoModel from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';
import type { IBookInfoModel } from '$lib/client/Domain/Entities/MongoDB/IBookInfoModel';
import { BookInfoMongoDBResource } from '$lib/server/Infrastructure/MongoDB/BookInfoDBResource';
import {
	getEntityTestData,
	getEntityTestDatas,
	testUserId1,
	testUserId2,
	testUserId3
} from '$lib/mock/Data';
import { Collection, Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

//共通で使用する接続データと、その初期化・破棄用の処理
let con: MongoClient;
let mongoServer: MongoMemoryServer;
let db: Db;
let col: Collection<IBookInfoModel>;

beforeEach(async () => {
	mongoServer = await MongoMemoryServer.create();
	con = await MongoClient.connect(mongoServer.getUri(), {});
	db = con.db(mongoServer.instanceInfo?.dbName);
	col = db.collection<IBookInfoModel>(env.BOOKINFOS_COLLECTION_NAME);
});
afterEach(async () => {
	if (con) {
		await con.close();
	}
	if (mongoServer) {
		await mongoServer.stop();
	}
});

const userId = 'firstData';

describe('get', () => {
	let datas: BookInfo[];
	beforeEach(() => {
		datas = getEntityTestDatas(testUserId1, testUserId2, testUserId3);
	});

	it('ユーザIDに一致するデータを取得できること', async () => {
		const preData = await col.insertMany([
			new BookInfoModel(datas[0]),
			new BookInfoModel(datas[1])
		]);
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, datas[0].userId);
		const response = await repos.get();

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(datas[0].userId.value);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const preData = await col.insertOne(new BookInfoModel(datas[0]));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, new UserId(testUserId2));
		const response = await repos.get();

		expect(response.length).toEqual(0);
	});
});

describe('getRecent', () => {
	let testDatas: BookInfo[];
	beforeEach(() => {
		testDatas = getEntityTestDatas();
	});

	it('直前に編集し、読んだ記録が保存されている、ユーザIDに一致するデータを1件のみ取得できること', async () => {
		const preData = await col.insertMany([
			new BookInfoModel(testDatas[0]),
			new BookInfoModel(testDatas[2])
		]);
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, testDatas[0].userId);
		const response = await repos.getRecent();

		expect(response).not.toBeUndefined();
		expect(response!.userId).toEqual(testDatas[0].userId.value);
		expect(response!.title).toEqual(testDatas[0].title);
		expect(response!.pageHistories?.length).toEqual(2);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const preData = await col.insertOne(new BookInfoModel(testDatas[0]));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, new UserId(testUserId2));
		const response = await repos.getRecent();

		expect(response).toBeUndefined();
	});
});

describe('getPageHistory', () => {
	let datas: BookInfo[];
	beforeEach(() => {
		datas = getEntityTestDatas();
	});

	it('ユーザIDに一致するデータの、historyのみを取得できること', async () => {
		const preData = await col.insertMany([
			new BookInfoModel(datas[0]),
			new BookInfoModel(datas[1]),
			new BookInfoModel(datas[2])
		]);
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, datas[0].userId);
		const response = await repos.getPageHistory();

		expect(response.length).toEqual(3);
		expect(response[0].length).toEqual(datas[0].pageHistories?.length);
		expect(response[0][0].id).toEqual(datas[0].pageHistories![0].value.id);

		expect(response[1].length).toEqual(datas[1].pageHistories?.length);
		expect(response[1][0].id).toEqual(datas[1].pageHistories![0].value.id);

		//3つ目は要素が0個
		expect(response[2].length).toEqual(datas[2].pageHistories?.length);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const preData = await col.insertOne(new BookInfoModel(datas[0]));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, new UserId(testUserId2));
		const response = await repos.getPageHistory();

		expect(response.length).toEqual(0);
	});
});

describe('getByStatus', () => {
	const testDatas = getEntityTestDatas();
	beforeEach(async () => {
		await col.insertMany([
			new BookInfoModel(testDatas[0]),
			new BookInfoModel(testDatas[1]),
			new BookInfoModel(testDatas[2])
		]);
	});

	it('statusがwishで、ユーザIDに一致するデータを取得できること', async () => {
		const repos = new BookInfoMongoDBResource(col, testDatas[0].userId);
		const response = await repos.getByStatus('wish');

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(testDatas[0].userId.value);
	});

	it('statusがreadingで、ユーザIDに一致するデータを取得できること', async () => {
		const repos = new BookInfoMongoDBResource(col, testDatas[1].userId);
		const response = await repos.getByStatus('reading');

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(testDatas[1].userId.value);
	});

	it('statusがcompleteで、ユーザIDに一致するデータを取得できること', async () => {
		const repos = new BookInfoMongoDBResource(col, testDatas[2].userId);
		const response = await repos.getByStatus('complete');

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(testDatas[2].userId.value);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const repos = new BookInfoMongoDBResource(col, new UserId('notExistData'));
		const response = await repos.getByStatus('wish');

		expect(response.length).toEqual(0);
	});
});

describe('insert', () => {
	let user1: BookInfo;
	beforeEach(() => {
		user1 = getEntityTestData(testUserId1);
	});

	it('書誌情報を保存できること', async () => {
		const repos = new BookInfoMongoDBResource(col, user1.userId);
		const response = await repos.insert(new BookInfoModel(user1));

		expect(response.ok).toBeTruthy();
		expect(await col.countDocuments({})).toBe(1);
	});

	it('データが不正(同じ_idで作成済み)な場合にエラーステータスが返ってくること', async () => {
		//事前にデータを作成
		const repos = new BookInfoMongoDBResource(col, user1.userId);
		await repos.insert(new BookInfoModel(user1));

		const response = await repos.insert(new BookInfoModel(user1));

		expect(response.ok).toBeFalsy();
	});

	it('保存済み書誌情報と同じデータを保存しようとした際にエラーステータスが返ってくること', async () => {
		const preData = await col.insertOne(new BookInfoModel(user1));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, user1.userId);
		const response = await repos.insert(new BookInfoModel(user1));

		expect(response.ok).toBeFalsy();
		expect(response.status).toEqual(409);
	});

	//MongoDB側のコレクション定義をして弾く必要があるのでスキップ
	// it.skip('データが不正(undefinedを渡す)な場合にエラーステータスが返ってくること', async () => {
	//   const result = await service.insertBookInfo({ bookInfos: col }, testData);

	//   expect(result.ok).toBeFalsy();
	// });
});

describe('isDuplicate', () => {
	let testData: BookInfo;
	beforeEach(async () => {
		testData = getEntityTestData();
		const preData = await col.insertOne(new BookInfoModel(testData));
		expect(await preData.acknowledged).toBeTruthy();
	});

	it('保存済みデータに一致するユーザIDとgapiIDを指定した際にTrueが返ること', async () => {
		const repos = new BookInfoMongoDBResource(col, testData.userId);
		const isDuplicate = await repos.isDuplicate(testData.gapiId!);

		expect(isDuplicate).toBeTruthy();
	});

	it('保存済みデータに一致しないユーザIDとgapiIDを指定した際にFalseが返ること', async () => {
		const repos = new BookInfoMongoDBResource(col, new UserId('test'));
		const isDuplicate = await repos.isDuplicate('test');

		expect(isDuplicate).toBeFalsy();
	});

	it('保存済みデータに一致するユーザIDと、一致しないgapiIDを指定した際にFalseが返ること', async () => {
		const repos = new BookInfoMongoDBResource(col, testData.userId);
		const isDuplicate = await repos.isDuplicate('test');

		expect(isDuplicate).toBeFalsy();
	});

	it('保存済みデータに一致しないユーザIDと、一致するgapiIDを指定した際にFalseが返ること', async () => {
		const repos = new BookInfoMongoDBResource(col, new UserId('test'));
		const isDuplicate = await repos.isDuplicate(testData.gapiId!);

		expect(isDuplicate).toBeFalsy();
	});
});

describe('update', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getEntityTestData();
	});

	it('書誌情報を更新でき、isCompleteReadingがTruethyな場合に完了日が更新されること', async () => {
		//事前にデータを作成
		const preData = await col.insertOne(new BookInfoModel(testData));
		expect(await preData.acknowledged).toBeTruthy();

		//以下の5つだけ更新可能
		testData.changeFavorite();
		testData.pageCount = 500;
		testData.setStatus(new Status('complete'));
		testData.memorandum = 'メモ欄編集';
		testData.addPageHistory(new PageHistory({ date: new Date(), pageCount: 100 }));

		const repos = new BookInfoMongoDBResource(col, testData.userId);
		const response = await repos.update(new BookInfoModel(testData), true);
		expect(response.ok).toBeTruthy();

		const updatedItem = await col.findOne({ userId: testData.userId.value });
		expect(updatedItem?.title).toEqual(testData.title);
		expect(updatedItem?.isFavorite).toEqual(testData.isFavorite);
		expect(updatedItem?.pageCount).toEqual(testData.pageCount);
		expect(updatedItem?.status).toEqual(testData.status.value);
		expect(updatedItem?.memorandum).toEqual(testData.memorandum);
		expect(updatedItem?.pageHistories!.length).toEqual(testData.pageHistories?.length);
		expect(updatedItem?.updateDate).not.toEqual(testData.updateDate); //更新日は自動更新
		expect(updatedItem?.completeDate).toBeDefined();
	});

	it('isCompleteReadingがFaulthyの場合にcompleteDateが更新されないこと', async () => {
		//事前にデータを作成
		const preData = await col.insertOne(new BookInfoModel(testData));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, testData.userId);
		const response = await repos.update(new BookInfoModel(testData), false);
		expect(response.ok).toBeTruthy();

		const updatedItem = await col.findOne({ userId: testData.userId.value });
		expect(updatedItem?.completeDate).null;
	});

	it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
		const repos = new BookInfoMongoDBResource(col, testData.userId);
		const response = await repos.update(new BookInfoModel(testData), true);

		expect(response.ok).toBeFalsy();
	});
});

//ValueObjectを修正したらこちらもEntityでなくIdを使うように修正する
describe('delete', async () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getEntityTestData();
	});

	it('書誌情報を削除できること', async () => {
		//対象のデータを設定
		const preData = await col.insertOne(new BookInfoModel(testData));
		expect(await preData.acknowledged).toBeTruthy();

		const repos = new BookInfoMongoDBResource(col, testData.userId);
		//Idはinsert時に設定されるので、testDataからではなくpreDataから取る
		const response = await repos.delete(preData.insertedId.toString());

		expect(response.ok).toBeTruthy();
		expect(await col.countDocuments({})).toBe(0);
	});

	it('削除対象が見つからない場合にエラーステータスが返ってくること', async () => {
		const repos = new BookInfoMongoDBResource(col, testData.userId);
		const response = await repos.delete(testData.id!.value);

		expect(response.ok).toBeFalsy();
	});
});
