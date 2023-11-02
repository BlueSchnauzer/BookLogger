import { describe, expect, it } from "vitest";
import * as service from "./database.service";
import { ObjectId } from "mongodb";
import type {BookInfo} from "../models/BookInfo";

//モックが上手く作れないので一旦テスト環境を直で操作

describe('getBookInfoByUserId', () => {
  it('ユーザIDに一致するデータを取得できること',async () => {
    const userId = 1;
    const response = await service.getBookInfoByUserId(userId);

    expect(response.length).toBeGreaterThanOrEqual(1);
    expect(response[0].userId).toEqual(userId);
  });

  it('一致するデータが無い場合に空のデータが返ること', async () => {
    const response = await service.getBookInfoByUserId(10000);

    expect(response.length).toEqual(0);
  });
});

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
    const result = await service.insertBookInfo(bookInfo);
    
    expect(result.status).toEqual(201);
  });

  it('データが不正な場合にエラーステータスが返ってくること', async () => {
    //作成済みデータを指定
    const invalidData = {_id: new ObjectId('6539488af433e43f49821121')} as BookInfo;
    const result = await service.insertBookInfo(invalidData);
    
    expect(result.status).toEqual(500);
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
    const result = await service.updateBookInfo(bookInfo);

    expect(result.status).toEqual(200);
  });

  it('更新対象が見つからない場合にエラーステータスが返ってくること', async () => {
    const invalidData = {_id: new ObjectId('a123456789b123456789c123')} as BookInfo;
    const result = await service.updateBookInfo(invalidData);

    expect(result.status).toEqual(400);
  });
});