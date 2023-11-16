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

const userId = 1;

describe('getBookInfo', () => {  
  it('ユーザIDに一致するデータを取得できること',async () => {
    const copiedInfo = structuredClone(oneBookInfo);
    copiedInfo.userId = 10000
    const preData = await col.insertMany([oneBookInfo, copiedInfo]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne({userId: 100} as BookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getBookInfo({ bookInfos: col }, 10000);

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getBookInfo({ bookInfos: col }, Number(undefined));

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
    const response = await service.getBookInfoByStatus({ bookInfos: col }, userId, 'wish');

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('statusがreadingで、ユーザIDに一致するデータを取得できること',async () => {
    const response = await service.getBookInfoByStatus({ bookInfos: col }, userId, 'reading');

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('statusがcompleteで、ユーザIDに一致するデータを取得できること',async () => {
    const response = await service.getBookInfoByStatus({ bookInfos: col }, userId, 'complete');

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const response = await service.getBookInfoByStatus({ bookInfos: col }, 10000, 'wish');

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getBookInfoByStatus({ bookInfos: col }, Number(undefined), 'wish');

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
    oneBookInfo.history.push({ date: new Date, currentPage: 100 });
    
    const result = await service.updateBookInfo({ bookInfos: col }, oneBookInfo);
    expect(result.ok).toBeTruthy();
    
    const updatedItem = await col.findOne({userId: oneBookInfo.userId});
    expect(updatedItem?.title).toEqual(oneBookInfo.title);
    expect(updatedItem?.isFavorite).toBeTruthy();
    expect(updatedItem?.status).toEqual('complete');
    expect(updatedItem?.memorandum).toBeTruthy();
    expect(updatedItem?.history.length).toEqual(2);
    expect(updatedItem?.updateDate).not.toEqual(oneBookInfo.updateDate); //更新日は自動更新
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