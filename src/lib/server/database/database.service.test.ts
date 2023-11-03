import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as service from "./database.service";
import type {BookInfo} from "../models/BookInfo";

describe('getBookInfoByUserId', () => {
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
  
  it('ユーザIDに一致するデータを取得できること',async () => {
    //対象のデータを設定
    const preData = await col.insertOne({userId: 1} as BookInfo);
    expect(await preData.acknowledged).toBeTruthy();

    const userId = 1;
    const response = await service.getBookInfoByUserId({ bookInfos: col }, userId);

    expect(response.length).toBeGreaterThanOrEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const response = await service.getBookInfoByUserId({ bookInfos: col }, 10000);

    expect(response.length).toEqual(0);
  });
});

describe('insertBookInfo', () => {
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

  it('データが不正な場合にエラーステータスが返ってくること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(bookInfo);
    expect(await preData.acknowledged).toBeTruthy();
  
    //作成済みデータを指定
    const invalidData = {_id: await preData.insertedId} as BookInfo;
    const result = await service.insertBookInfo({ bookInfos: col }, invalidData);
    
    expect(result.ok).toBeFalsy();
  });
});

describe('updateBookInfo', () => {
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