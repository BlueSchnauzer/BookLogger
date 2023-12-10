import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as service from "$lib/server/database/bookInfo.service";
import type { BookInfo } from '$lib/server/models/BookInfo';
import { oneBookInfo, threeBookInfos } from '$lib/vitest-setup';

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
  if (con) { await con.close(); }
  if (mongoServer) { await mongoServer.stop(); }
});

const userId = 'firstData';

describe('getBookInfo', () => {  
  it('ユーザIDに一致するデータを取得できること',async () => {
    const copiedInfo = structuredClone(oneBookInfo);
    copiedInfo.userId = 'copiedData'
    const preData = await col.insertMany([oneBookInfo, copiedInfo]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne({userId: 'savedData'} as BookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getBookInfo({ bookInfos: col }, 'defferentData');

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getBookInfo({ bookInfos: col }, String(undefined));

    expect(response.length).toEqual(0);
  });
});

describe('getRecentBookInfo', () => {  
  it('直前に編集した、ユーザIDに一致するデータを1件のみ取得できること',async () => {
    const copiedInfo = structuredClone(oneBookInfo);

    const first = await col.insertOne(oneBookInfo);
    expect(await first.acknowledged).toBeTruthy();

    copiedInfo.title = 'recentbook';
    copiedInfo.updateDate = new Date;
    const second = await col.insertOne(copiedInfo);
    expect(await second.acknowledged).toBeTruthy();

    const response = await service.getRecentBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
    expect(response[0].title).toEqual('recentbook');
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne({userId: 'savedData'} as BookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getRecentBookInfo({ bookInfos: col }, 'defferentData');

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getRecentBookInfo({ bookInfos: col }, String(undefined));

    expect(response.length).toEqual(0);
  });
});

describe('getBookInfoWithOnlyHistory', () => {  
  it('ユーザIDに一致するデータの、historyのみを取得できること',async () => {
    const copiedInfo = structuredClone(oneBookInfo);
    copiedInfo.userId = 'copiedData'
    const preData = await col.insertMany([oneBookInfo, copiedInfo]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getBookInfoWithOnlyHistory({ bookInfos: col }, userId);

    expect(response).not.toBeUndefined();
    expect(response?.length).toEqual(1);
    expect(response[0].history?.[0].currentPage).toEqual(0);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne({userId: 'savedData'} as BookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getBookInfoWithOnlyHistory({ bookInfos: col }, 'defferentData');

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getBookInfoWithOnlyHistory({ bookInfos: col }, String(undefined));

    expect(response.length).toEqual(0);
  });
});

describe('getBookInfoByStatus', () => {  
  beforeEach(async () => {
    threeBookInfos[0].status = 'wish';
    threeBookInfos[1].status = 'reading';
    threeBookInfos[2].status = 'complete';
    await col.insertMany(threeBookInfos);
  });
  
  it('statusがwishで、ユーザIDに一致するデータを取得できること',async () => {
    const wishId = 'firstData';
    const response = await service.getBookInfoByStatus({ bookInfos: col }, wishId, 'wish');

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(wishId);
  });

  it('statusがreadingで、ユーザIDに一致するデータを取得できること',async () => {
    const readingId = 'secondData';
    const response = await service.getBookInfoByStatus({ bookInfos: col }, readingId, 'reading');

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(readingId);
  });

  it('statusがcompleteで、ユーザIDに一致するデータを取得できること',async () => {
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
    const response = await service.getBookInfoByStatus({ bookInfos: col }, String(undefined), 'wish');

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

describe('insertBookInfo', () => {
  it('書誌情報を保存できること', async () => {
    const result = await service.insertBookInfo({ bookInfos: col }, oneBookInfo);
    expect(result.ok).toBeTruthy();
    expect(await col.countDocuments({})).toBe(1);
  });

  it('データが不正(同じ_idで作成済み)な場合にエラーステータスが返ってくること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(oneBookInfo);
    expect(await preData.acknowledged).toBeTruthy();
  
    //作成済みデータを指定
    const invalidData = {_id: await preData.insertedId} as BookInfo;
    const result = await service.insertBookInfo({ bookInfos: col }, invalidData);
    
    expect(result.ok).toBeFalsy();
  });

  //MongoDB側のコレクション定義をして弾く必要があるのでスキップ
  it.skip('データが不正(undefinedを渡す)な場合にエラーステータスが返ってくること', async () => {  
    const result = await service.insertBookInfo({ bookInfos: col }, oneBookInfo);
    
    expect(result.ok).toBeFalsy();
  });
});

describe('updateBookInfo', () => {
  it('書誌情報を更新できること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(oneBookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    //以下の4つだけ更新可能
    oneBookInfo.isFavorite = true;
    oneBookInfo.status = 'complete';
    oneBookInfo.memorandum = 'メモ欄編集'
    oneBookInfo.history!.push({ date: new Date, currentPage: 100 });
    
    const result = await service.updateBookInfo({ bookInfos: col }, oneBookInfo);
    expect(result.ok).toBeTruthy();
    
    const updatedItem = await col.findOne({userId: oneBookInfo.userId});
    expect(updatedItem?.title).toEqual(oneBookInfo.title);
    expect(updatedItem?.isFavorite).toBeTruthy();
    expect(updatedItem?.status).toEqual('complete');
    expect(updatedItem?.memorandum).toBeTruthy();
    expect(updatedItem?.history!.length).toEqual(2);
    expect(updatedItem?.updateDate).not.toEqual(oneBookInfo.updateDate); //更新日は自動更新
  });

  it('isCompleteがFaulthyの場合にcompleteDateが更新されないこと', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(oneBookInfo);
    expect(await preData.acknowledged).toBeTruthy();
    
    const result = await service.updateBookInfo({ bookInfos: col }, oneBookInfo, false);
    expect(result.ok).toBeTruthy();

    const updatedItem = await col.findOne({userId: oneBookInfo.userId});
    expect(updatedItem?.updateDate).not.toEqual(oneBookInfo.updateDate); 
    expect(updatedItem?.completeDate).not.toBeDefined();
  });

  it('isCompleteがTruthyの場合にcompleteDateが更新されること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(oneBookInfo);
    expect(await preData.acknowledged).toBeTruthy();
    
    const result = await service.updateBookInfo({ bookInfos: col }, oneBookInfo, true);
    expect(result.ok).toBeTruthy();

    const updatedItem = await col.findOne({userId: oneBookInfo.userId});
    expect(updatedItem?.updateDate).not.toEqual(oneBookInfo.updateDate); 
    expect(updatedItem?.completeDate).toBeDefined();
  });

  it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
    const result = await service.updateBookInfo({ bookInfos: col }, oneBookInfo);

    expect(result.ok).toBeFalsy();
  });
});

describe('deleteBookInfo', async () => {
  it('書誌情報を削除できること', async () => {
    //対象のデータを設定
    const preData = await col.insertOne(oneBookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const result = await service.deleteBookInfo({ bookInfos: col }, preData.insertedId);
    expect(result.ok).toBeTruthy();
    expect(await col.countDocuments({})).toBe(0);
  });

  it('削除対象が見つからない場合にエラーステータスが返ってくること', async () => {
    const result = await service.deleteBookInfo({ bookInfos: col }, new ObjectId('123456789a123456789b1234'));
    expect(result.ok).toBeFalsy();
  });
});