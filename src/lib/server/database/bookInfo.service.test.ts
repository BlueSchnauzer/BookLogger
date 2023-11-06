import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as service from "$lib/server/database/bookInfo.service";
import type { BookInfo } from '$lib/server/models/BookInfo';

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
    const preData = await col.insertMany([{userId}, {userId: 10}] as BookInfo[]);
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

describe('getWishBookInfo', () => {  
  it('historyが空で、ユーザIDに一致するデータを取得できること',async () => {
    const dummyData = [
      {userId, history: [{date: new Date, currentPage: 50}]}, 
      {userId, history: undefined}, 
      {userId: 10, history: undefined}
    ];
    const preData = await col.insertMany(dummyData as BookInfo[]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getWishBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const dummyData = [
      {userId: 10, history: undefined}, 
      {userId, history: [{date: new Date, currentPage: 50}]}
    ];
    const preData = await col.insertMany(dummyData as BookInfo[]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getWishBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getWishBookInfo({ bookInfos: col }, Number(undefined));

    expect(response.length).toEqual(0);
  });
});

describe('getReadingBookInfo', () => {  
  it('isCompletedがFalseでhistoryに記録がある、ユーザIDに一致するデータを取得できること',async () => {
    const dummyData = [
      {userId, history: [{date: new Date, currentPage: 50}], isCompleted: false}, 
      {userId, history: [{date: new Date, currentPage: 50}], isCompleted: false}, 
      {userId: 10, history: [{date: new Date, currentPage: 50}], isCompleted: false}, 
      {userId, history: [{date: new Date, currentPage: 300}], isCompleted: true}
    ];
    const preData = await col.insertMany(dummyData as BookInfo[]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getReadingBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(2);
    expect(response[0].userId).toEqual(userId);
    expect(response[1].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const dummyData = [
      {userId, history: [{date: new Date, currentPage: 300}], isCompleted: true},
      {userId: 10, history: [{date: new Date, currentPage: 50}], isCompleted: false} 
    ];
    const preData = await col.insertMany(dummyData as BookInfo[]);
    expect(await preData.acknowledged).toBeTruthy();

    const response = await service.getReadingBookInfo({ bookInfos: col }, userId);

    expect(response.length).toEqual(0);
  });

  it('ユーザIDが不正な場合に空のデータが返ること', async () => {
    const response = await service.getReadingBookInfo({ bookInfos: col }, Number(undefined));

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
  const bookInfo: BookInfo = {
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: ''
    },
    title: `TestInsert ${Date.now()}`,
    author: ['TestAuthor'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    history: [{
        date: new Date,
        currentPage: 0
    }],
    isFavorite: false,
    isCompleted: false,
    memorandum: 'メモです1'
  }

  it('書誌情報を保存できること', async () => {
    const result = await service.insertBookInfo({ bookInfos: col }, bookInfo);
    expect(result.ok).toBeTruthy();
    expect(await col.countDocuments({})).toBe(1);
  });

  it('データが不正(同じ_idで作成済み)な場合にエラーステータスが返ってくること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(bookInfo);
    expect(await preData.acknowledged).toBeTruthy();
  
    //作成済みデータを指定
    const invalidData = {_id: await preData.insertedId} as BookInfo;
    const result = await service.insertBookInfo({ bookInfos: col }, invalidData);
    
    expect(result.ok).toBeFalsy();
  });

  //MongoDB側のコレクション定義をして弾く必要があるのでスキップ
  it.skip('データが不正(undefinedを渡す)な場合にエラーステータスが返ってくること', async () => {  
    const result = await service.insertBookInfo({ bookInfos: col }, bookInfo);
    
    expect(result.ok).toBeFalsy();
  });
});

describe('updateBookInfo', () => {
  const bookInfo: BookInfo = {
    _id: new ObjectId('6539488af433e43f49821121'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: 'updatedItem'
    },
    title: `更新テスト ${Date.now()}`,
    author: ['TestAuthor'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    history: [{
        date: new Date,
        currentPage: 0
    }],
    isFavorite: false,
    isCompleted: false,
    memorandum: '更新用'
  }

  it('書誌情報を更新できること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(bookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    //以下の3つだけ更新可能
    bookInfo.isFavorite = true;
    bookInfo.history.push({ date: new Date, currentPage: 100 });
    bookInfo.memorandum = 'メモ欄編集'
    
    const result = await service.updateBookInfo({ bookInfos: col }, bookInfo);
    expect(result.ok).toBeTruthy();
    
    const updatedItem = await col.findOne({userId: bookInfo.userId});
    expect(updatedItem?.title).toEqual(bookInfo.title);
    expect(updatedItem?.isFavorite).toBeTruthy();
    expect(updatedItem?.history.length).toEqual(2);
    expect(updatedItem?.memorandum).toBeTruthy();
    expect(updatedItem?.updateDate).not.toEqual(bookInfo.updateDate); //更新日は自動更新
  });

  it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
    const result = await service.updateBookInfo({ bookInfos: col }, bookInfo);
    expect(result.ok).toBeFalsy();
  });
});

describe('deleteBookInfo', async () => {
  it('書誌情報を削除できること', async () => {
    //対象のデータを設定
    const preData = await col.insertOne({userId: 1} as BookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const result = await service.deleteBookInfo({ bookInfos: col }, preData.insertedId);
    expect(result.ok).toBeTruthy();
    expect(await col.countDocuments({})).toBe(0);
  });

  it('削除対象が見つからない場合にエラーステータスが返ってくること', async () => {
    const result = await service.deleteBookInfo({ bookInfos: col }, new ObjectId('a123456789b123456789c123'));
    expect(result.ok).toBeFalsy();
  });
});