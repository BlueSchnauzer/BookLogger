import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as service from '$lib/server/database/bookInfo.service';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { getTestData, threeBookInfos } from '$lib/vitest-setup';

//共通で使用する接続データと、その初期化・破棄用の処理
let con: MongoClient;
let mongoServer: MongoMemoryServer;
let db: Db;
let col: Collection<BookInfo>;

beforeEach(async () => {
	mongoServer = await MongoMemoryServer.create();
	con = await MongoClient.connect(mongoServer.getUri(), {});
	db = con.db(mongoServer.instanceInfo?.dbName);
	col = db.collection<BookInfo>(env.BOOKINFOS_COLLECTION_NAME);
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

describe.skip('getBookInfo', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('ユーザIDに一致するデータを取得できること', async () => {
		const copiedInfo = structuredClone(testData);
		copiedInfo.userId = 'copiedData';
		const preData = await col.insertMany([testData, copiedInfo]);
		expect(await preData.acknowledged).toBeTruthy();

		const response = await service.getBookInfo({ bookInfos: col }, userId);

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(userId);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const preData = await col.insertOne({ userId: 'savedData' } as BookInfo);
		expect(await preData.acknowledged).toBeTruthy();

		const response = await service.getBookInfo({ bookInfos: col }, 'defferentData');

		expect(response.length).toEqual(0);
	});

	it('ユーザIDが不正な場合に空のデータが返ること', async () => {
		const response = await service.getBookInfo({ bookInfos: col }, String(undefined));

		expect(response.length).toEqual(0);
	});
});

describe.skip('getRecentBookInfo', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('直前に編集し、読んだ記録が保存されている、ユーザIDに一致するデータを1件のみ取得できること', async () => {
		const copiedInfo = structuredClone(testData);

		testData.pageHistory = undefined;
		const first = await col.insertOne(testData);
		expect(await first.acknowledged).toBeTruthy();

		copiedInfo.title = 'recentbook';
		copiedInfo.updateDate = new Date();
		copiedInfo.pageHistory = undefined;
		copiedInfo.pageHistory = [] as any;
		copiedInfo.pageHistory?.push({ id: crypto.randomUUID(), date: new Date(), currentPage: 10 });
		const second = await col.insertOne(copiedInfo);
		expect(await second.acknowledged).toBeTruthy();

		const response = await service.getRecentBookInfo({ bookInfos: col }, userId);

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(userId);
		expect(response[0].title).toEqual('recentbook');
		expect(response[0].pageHistory?.length).toEqual(1);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const preData = await col.insertOne({ userId: 'savedData' } as BookInfo);
		expect(await preData.acknowledged).toBeTruthy();

		const response = await service.getRecentBookInfo({ bookInfos: col }, 'savedData');

		expect(response.length).toEqual(0);
	});

	it('ユーザIDが不正な場合に空のデータが返ること', async () => {
		const response = await service.getRecentBookInfo({ bookInfos: col }, String(undefined));

		expect(response.length).toEqual(0);
	});
});

describe.skip('getBookInfoWithOnlyHistory', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('ユーザIDに一致するデータの、historyのみを取得できること', async () => {
		const copiedInfo = structuredClone(testData);
		copiedInfo.userId = 'copiedData';
		const preData = await col.insertMany([testData, copiedInfo]);
		expect(await preData.acknowledged).toBeTruthy();

		const response = await service.getBookInfoWithOnlyPageHistory({ bookInfos: col }, userId);

		expect(response).not.toBeUndefined();
		expect(response?.length).toEqual(1);
		expect(response[0].pageHistory?.[0].currentPage).toEqual(0);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const preData = await col.insertOne({ userId: 'savedData' } as BookInfo);
		expect(await preData.acknowledged).toBeTruthy();

		const response = await service.getBookInfoWithOnlyPageHistory(
			{ bookInfos: col },
			'defferentData'
		);

		expect(response.length).toEqual(0);
	});

	it('ユーザIDが不正な場合に空のデータが返ること', async () => {
		const response = await service.getBookInfoWithOnlyPageHistory(
			{ bookInfos: col },
			String(undefined)
		);

		expect(response.length).toEqual(0);
	});
});

describe.skip('getBookInfoByStatus', () => {
	const testDatas = threeBookInfos;
	beforeEach(async () => {
		testDatas[0].status = 'wish';
		testDatas[1].status = 'reading';
		testDatas[2].status = 'complete';
		await col.insertMany(testDatas);
	});

	it('statusがwishで、ユーザIDに一致するデータを取得できること', async () => {
		const wishId = 'firstData';
		const response = await service.getBookInfoByStatus({ bookInfos: col }, wishId, 'wish');

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(wishId);
	});

	it('statusがreadingで、ユーザIDに一致するデータを取得できること', async () => {
		const readingId = 'secondData';
		const response = await service.getBookInfoByStatus({ bookInfos: col }, readingId, 'reading');

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(readingId);
	});

	it('statusがcompleteで、ユーザIDに一致するデータを取得できること', async () => {
		const completeId = 'thirdData';
		const response = await service.getBookInfoByStatus({ bookInfos: col }, completeId, 'complete');

		expect(response.length).toEqual(1);
		expect(response[0].userId).toEqual(completeId);
	});

	it('一致するデータが無い場合に空のデータが返ること', async () => {
		const response = await service.getBookInfoByStatus({ bookInfos: col }, 'notExistData', 'wish');

		expect(response.length).toEqual(0);
	});

	it('ユーザIDが不正な場合に空のデータが返ること', async () => {
		const response = await service.getBookInfoByStatus(
			{ bookInfos: col },
			String(undefined),
			'wish'
		);

		expect(response.length).toEqual(0);
	});

	it('statusが不正な場合に空のデータが返ること', async () => {
		const response = await service.getBookInfoByStatus({ bookInfos: col }, userId, 'test' as any);

		expect(response.length).toEqual(0);
	});
});

// describe('getBookInfoByFavorite', () => {
//   it('お気に入りがTrueで、ユーザIDに一致するデータのみが取得できること', async () => {
//     //対象のデータを設定
//     const dummyData = [{userId, isFavorite: true}, {userId, isFavorite: true}, {userId, isFavorite: false}];
//     const preData = await col.insertMany( dummyData as BookInfo[]);
//     expect(await preData.acknowledged).toBeTruthy();

//     const response = await service.getBookInfoByFavorite({ bookInfos: col }, userId);

//     expect(response.length).toEqual(2);
//     expect(response[0].userId).toEqual(userId);
//   });

//   it('一致するデータが無い場合に空のデータが返ること', () => {

//   });
// });

describe.skip('insertBookInfo', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('書誌情報を保存できること', async () => {
		const result = await service.insertBookInfo({ bookInfos: col }, testData);
		expect(result.ok).toBeTruthy();
		expect(await col.countDocuments({})).toBe(1);
	});

	it('データが不正(同じ_idで作成済み)な場合にエラーステータスが返ってくること', async () => {
		//事前にデータを作成
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();

		//作成済みデータを指定
		const invalidData = { _id: await preData.insertedId } as BookInfo;
		const result = await service.insertBookInfo({ bookInfos: col }, invalidData);

		expect(result.ok).toBeFalsy();
	});

	it('保存済み書誌情報と同じデータを保存しようとした際にエラーステータスが返ってくること', async () => {
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();

		const result = await service.insertBookInfo({ bookInfos: col }, testData);

		expect(result.ok).toBeFalsy();
		expect(result.status).toEqual(409);
	});

	//MongoDB側のコレクション定義をして弾く必要があるのでスキップ
	it.skip('データが不正(undefinedを渡す)な場合にエラーステータスが返ってくること', async () => {
		const result = await service.insertBookInfo({ bookInfos: col }, testData);

		expect(result.ok).toBeFalsy();
	});
});

describe.skip('isDuplicateBookInfo', () => {
	let testData: BookInfo;
	let userId: string;
	let gapiId = 'gapiId';
	beforeEach(async () => {
		testData = getTestData();
		userId = testData.userId;

		testData.gapiId = gapiId;
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();
	});

	it('保存済みデータに一致するユーザIDとgapiIDを指定した際にTrueが返ること', async () => {
		const isDuplicate = await service.isDuplicateBookInfo({ bookInfos: col }, userId, gapiId);
		expect(isDuplicate).toBeTruthy();
	});

	it('保存済みデータに一致しないユーザIDとgapiIDを指定した際にFalseが返ること', async () => {
		const isDuplicate = await service.isDuplicateBookInfo(
			{ bookInfos: col },
			`test_${userId}`,
			`test_${gapiId}`
		);
		expect(isDuplicate).toBeFalsy();
	});

	it('保存済みデータに一致するユーザIDと、一致しないgapiIDを指定した際にFalseが返ること', async () => {
		const isDuplicate = await service.isDuplicateBookInfo(
			{ bookInfos: col },
			userId,
			`test_${gapiId}`
		);
		expect(isDuplicate).toBeFalsy();
	});

	it('保存済みデータに一致しないユーザIDと、一致するgapiIDを指定した際にFalseが返ること', async () => {
		const isDuplicate = await service.isDuplicateBookInfo(
			{ bookInfos: col },
			`test_${userId}`,
			gapiId
		);
		expect(isDuplicate).toBeFalsy();
	});
});

describe.skip('updateBookInfo', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('書誌情報を更新できること', async () => {
		//事前にデータを作成
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();

		//以下の4つだけ更新可能
		testData.isFavorite = true;
		testData.pageCount = 500;
		testData.status = 'complete';
		testData.memorandum = 'メモ欄編集';
		testData.pageHistory!.push({ id: crypto.randomUUID(), date: new Date(), currentPage: 100 });

		const result = await service.updateBookInfo({ bookInfos: col }, testData);
		expect(result.ok).toBeTruthy();

		const updatedItem = await col.findOne({ userId: testData.userId });
		expect(updatedItem?.title).toEqual(testData.title);
		expect(updatedItem?.isFavorite).toBeTruthy();
		expect(updatedItem?.pageCount).toEqual(testData.pageCount);
		expect(updatedItem?.status).toEqual('complete');
		expect(updatedItem?.memorandum).toBeTruthy();
		expect(updatedItem?.pageHistory!.length).toEqual(2);
		expect(updatedItem?.updateDate).not.toEqual(testData.updateDate); //更新日は自動更新
	});

	it('isCompleteがFaulthyの場合にcompleteDateが更新されないこと', async () => {
		//事前にデータを作成
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();

		const result = await service.updateBookInfo({ bookInfos: col }, testData, false);
		expect(result.ok).toBeTruthy();

		const updatedItem = await col.findOne({ userId: testData.userId });
		expect(updatedItem?.updateDate).not.toEqual(testData.updateDate);
		expect(updatedItem?.completeDate).not.toBeDefined();
	});

	it('isCompleteがTruthyの場合にcompleteDateが更新されること', async () => {
		//事前にデータを作成
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();

		const result = await service.updateBookInfo({ bookInfos: col }, testData, true);
		expect(result.ok).toBeTruthy();

		const updatedItem = await col.findOne({ userId: testData.userId });
		expect(updatedItem?.updateDate).not.toEqual(testData.updateDate);
		expect(updatedItem?.completeDate).toBeDefined();
	});

	it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
		const result = await service.updateBookInfo({ bookInfos: col }, testData);

		expect(result.ok).toBeFalsy();
	});
});

describe.skip('deleteBookInfo', async () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('書誌情報を削除できること', async () => {
		//対象のデータを設定
		const preData = await col.insertOne(testData);
		expect(await preData.acknowledged).toBeTruthy();

		const result = await service.deleteBookInfo({ bookInfos: col }, preData.insertedId);
		expect(result.ok).toBeTruthy();
		expect(await col.countDocuments({})).toBe(0);
	});

	it('削除対象が見つからない場合にエラーステータスが返ってくること', async () => {
		const result = await service.deleteBookInfo(
			{ bookInfos: col },
			new ObjectId('123456789a123456789b1234')
		);
		expect(result.ok).toBeFalsy();
	});
});
