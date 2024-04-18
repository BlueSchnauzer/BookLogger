import * as env from '$env/static/private';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BookInfoMongoDB } from "$lib/server/Infrastructure/MongoDB/BookInfo";
import type { BookInfo } from '$lib/server/Domain/Entities/BookInfo';
import BookInfoModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import { getTestData, getEntityTestData, getTestDatas, getEntityTestDatas, testUserId1, testUserId2, testUserId3 } from '$lib/vitest-setup';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status } from '$lib/server/Domain/ValueObjects/BookInfo/Status';

//共通で使用する接続データと、その初期化・破棄用の処理
let con: MongoClient;
let mongoServer: MongoMemoryServer;
let db: Db;
let col: Collection<BookInfoModel>;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  con = await MongoClient.connect(mongoServer.getUri(), {});
  db = con.db(mongoServer.instanceInfo?.dbName);
  col = db.collection<BookInfoModel>(env.BOOKINFOS_COLLECTION_NAME);
});
afterEach(async () => {
  if (con) { await con.close(); }
  if (mongoServer) { await mongoServer.stop(); }
});

const userId = 'firstData';

describe('get', () => {  
  let user1: BookInfo;
  beforeEach(() => {
    user1 = getEntityTestData(testUserId1);
  });

  it('ユーザIDに一致するデータを取得できること',async () => {
    const user2 = getEntityTestData(testUserId2);

    const preData = await col.insertMany([new BookInfoModel(user1), new BookInfoModel(user2)]);
    expect(await preData.acknowledged).toBeTruthy();

    const repos = new BookInfoMongoDB(col, user1.userId);
    const response = await repos.get();

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(user1.userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne(new BookInfoModel(user1));
    expect(await preData.acknowledged).toBeTruthy();

    const repos = new BookInfoMongoDB(col, new UserId(testUserId2));
    const response = await repos.get();

    expect(response.length).toEqual(0);
  });
});

describe('getRecent', () => {  
  let user1: BookInfo;
  beforeEach(() => {
    user1 = getEntityTestData(testUserId1);
  });

  it('直前に編集し、読んだ記録が保存されている、ユーザIDに一致するデータを1件のみ取得できること',async () => {
    const user2 = getEntityTestData(testUserId2);

    const preData = await col.insertMany([new BookInfoModel(user1), new BookInfoModel(user2)]);
    expect(await preData.acknowledged).toBeTruthy();

    const repos = new BookInfoMongoDB(col, user1.userId);
    const response = await repos.getRecent();

    expect(response.length).toEqual(1);
    expect(response[0].userId.equals(user1.userId)).toBeTruthy();
    expect(response[0].title).toEqual(user1.title);
    expect(response[0].pageHistories?.length).toEqual(1);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne(new BookInfoModel(user1));
    expect(await preData.acknowledged).toBeTruthy();

    const repos = new BookInfoMongoDB(col, new UserId(testUserId2));
    const response = await repos.getRecent();

    expect(response.length).toEqual(0);
  });
});

describe('getPageHistory', () => {  
  let user1: BookInfo;
  beforeEach(() => {
    user1 = getEntityTestData(testUserId1);
  });

 it('ユーザIDに一致するデータの、historyのみを取得できること',async () => {
    const user2 = getEntityTestData(testUserId2);

    const preData = await col.insertMany([new BookInfoModel(user1), new BookInfoModel(user2)]);
    expect(await preData.acknowledged).toBeTruthy();

    const repos = new BookInfoMongoDB(col, user1.userId);
    const response = await repos.getPageHistory();

    expect(response.length).toEqual(1);   
    // expect(response).not.toBeUndefined();
    // expect(response?.length).toEqual(1);
    // expect(response[0].pageHistory?.[0].currentPage).toEqual(0);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const preData = await col.insertOne(new BookInfoModel(user1));
    expect(await preData.acknowledged).toBeTruthy();

    const repos = new BookInfoMongoDB(col, new UserId(testUserId2));
    const response = await repos.getPageHistory();

    expect(response.length).toEqual(0);
  });
});

describe('getByStatus', () => {  
  const testDatas = getEntityTestDatas();
  beforeEach(async () => {
    await col.insertMany([new BookInfoModel(testDatas[0]), new BookInfoModel(testDatas[1]), new BookInfoModel(testDatas[2])]);
  });
  
  it('statusがwishで、ユーザIDに一致するデータを取得できること',async () => {
    const repos = new BookInfoMongoDB(col, testDatas[0].userId);
    const response = await repos.getByStatus(new Status('wish'));

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(testDatas[0].userId);
  });

  it('statusがreadingで、ユーザIDに一致するデータを取得できること',async () => {
    const repos = new BookInfoMongoDB(col, testDatas[1].userId);
    const response = await repos.getByStatus(new Status('reading'));

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(testDatas[1].userId);
  });

  it('statusがcompleteで、ユーザIDに一致するデータを取得できること',async () => {
    const repos = new BookInfoMongoDB(col, testDatas[2].userId);
    const response = await repos.getByStatus(new Status('complete'));

    expect(response.length).toEqual(1);
    expect(response[0].userId).toEqual(testDatas[2].userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const repos = new BookInfoMongoDB(col, new UserId('notExistData'));
    const response = await repos.getByStatus(new Status('wish'));

    expect(response.length).toEqual(0);
  });
});

describe('insert', () => {
  let user1: BookInfo;
  beforeEach(() => {
    user1 = getEntityTestData(testUserId1);
  });

  it('書誌情報を保存できること', async () => {
    const repos = new BookInfoMongoDB(col, user1.userId);
    const response = await repos.insert(user1)

    expect(response.ok).toBeTruthy();
    expect(await col.countDocuments({})).toBe(1);
  });

  it.skip('データが不正(同じ_idで作成済み)な場合にエラーステータスが返ってくること', async () => {
    //事前にデータを作成
    const repos = new BookInfoMongoDB(col, user1.userId);
    await repos.insert(user1)
  
    //再度同じデータを作成 → エラーになってほしいがそのままいけちゃう
    const response = await repos.insert(user1)
    
    expect(response.ok).toBeFalsy();
  });

  it.skip('保存済み書誌情報と同じデータを保存しようとした際にエラーステータスが返ってくること', async () => {
    const preData = await col.insertOne(new BookInfoModel(user1));
    expect(await preData.acknowledged).toBeTruthy();
  
    const repos = new BookInfoMongoDB(col, user1.userId);
    const response = await repos.insert(user1);
    
    //なぜか登録できちゃうので調べる

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
  })

  it('保存済みデータに一致するユーザIDとgapiIDを指定した際にTrueが返ること', async () => {
    const repos = new BookInfoMongoDB(col, testData.userId);
    const isDuplicate = await repos.isDuplicate(testData.gapiId!);

    expect(isDuplicate).toBeTruthy();
  })

  it('保存済みデータに一致しないユーザIDとgapiIDを指定した際にFalseが返ること', async () => {
    const repos = new BookInfoMongoDB(col, new UserId('test'));
    const isDuplicate = await repos.isDuplicate('test');

    expect(isDuplicate).toBeFalsy();
  })

  it('保存済みデータに一致するユーザIDと、一致しないgapiIDを指定した際にFalseが返ること', async () => {
    const repos = new BookInfoMongoDB(col, testData.userId);
    const isDuplicate = await repos.isDuplicate('test');

    expect(isDuplicate).toBeFalsy();
  })

  it('保存済みデータに一致しないユーザIDと、一致するgapiIDを指定した際にFalseが返ること', async () => {
    const repos = new BookInfoMongoDB(col, new UserId('test'));
    const isDuplicate = await repos.isDuplicate(testData.gapiId!);

    expect(isDuplicate).toBeFalsy();
  })
});

describe('update', () => {
  let testData: BookInfo;
  beforeEach(() => {
    testData = getTestData();
  })

  it('書誌情報を更新できること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(testData);
    expect(await preData.acknowledged).toBeTruthy();

    //以下の4つだけ更新可能
    testData.isFavorite = true;
    testData.pageCount = 500;
    testData.status = 'complete';
    testData.memorandum = 'メモ欄編集'
    testData.pageHistory!.push({id: crypto.randomUUID(), date: new Date, currentPage: 100 });
    
    const repos = new BookInfoMongoDB(col, new UserId(userId));
    const response = await repos.update(testData, true);
    expect(response.ok).toBeTruthy();
    
    const updatedItem = await col.findOne({userId: testData.userId});
    expect(updatedItem?.title).toEqual(testData.title);
    expect(updatedItem?.isFavorite).toBeTruthy();
    expect(updatedItem?.pageCount).toEqual(testData.pageCount);
    expect(updatedItem?.status).toEqual('complete');
    expect(updatedItem?.memorandum).toBeTruthy();
    expect(updatedItem?.pageHistories!.length).toEqual(2);
    expect(updatedItem?.updateDate).not.toEqual(testData.updateDate); //更新日は自動更新
  });

  it('isCompleteがFaulthyの場合にcompleteDateが更新されないこと', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(testData);
    expect(await preData.acknowledged).toBeTruthy();
    
    const repos = new BookInfoMongoDB(col, new UserId(userId));
    const response = await repos.update(testData, false);
    expect(response.ok).toBeTruthy();

    const updatedItem = await col.findOne({userId: testData.userId});
    expect(updatedItem?.updateDate).not.toEqual(testData.updateDate); 
    expect(updatedItem?.completeDate).not.toBeDefined();
  });

  it('isCompleteがTruthyの場合にcompleteDateが更新されること', async () => {
    //事前にデータを作成
    const preData = await col.insertOne(testData);
    expect(await preData.acknowledged).toBeTruthy();
    
    const repos = new BookInfoMongoDB(col, new UserId(userId));
    const response = await repos.update(testData, true);
    expect(response.ok).toBeTruthy();

    const updatedItem = await col.findOne({userId: testData.userId});
    expect(updatedItem?.updateDate).not.toEqual(testData.updateDate); 
    expect(updatedItem?.completeDate).toBeDefined();
  });

  it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
    const repos = new BookInfoMongoDB(col, new UserId(userId));
    const response = await repos.update(testData, true);

    expect(response.ok).toBeFalsy();
  });
});

//ValueObjectを修正したらこちらもEntityでなくIdを使うように修正する
// describe('delete', async () => {
//   let testData: BookInfo;
//   beforeEach(() => {
//     testData = getTestData();
//   })

//   it('書誌情報を削除できること', async () => {
//     //対象のデータを設定
//     const preData = await col.insertOne(testData);
//     expect(await preData.acknowledged).toBeTruthy();

//     const repos = new BookInfoMongoDB(col, new UserId(userId));
//     const response = await repos.delete(testData);

//     expect(response.ok).toBeTruthy();
//     expect(await col.countDocuments({})).toBe(0);
//   });

  // it('削除対象が見つからない場合にエラーステータスが返ってくること', async () => {
  //   const repos = new BookInfoMongoDB(col, new UserId(userId));
  //   const response = await repos.delete()

  //   const result = await service.deleteBookInfo({ bookInfos: col }, new ObjectId('123456789a123456789b1234'));
  //   expect(result.ok).toBeFalsy();
  // });
// });