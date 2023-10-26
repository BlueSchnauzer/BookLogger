import { describe, expect, it } from "vitest";
import { getBookInfoByUserId, insertBookInfo } from "./database.service";
import { ObjectId } from "mongodb";
import type {BookInfo} from "../models/BookInfo";

describe('getBookInfoByUserId', () => {
  it('ユーザIDに一致するデータを取得できること',async () => {
    const userId = 1;
    const response = await getBookInfoByUserId(userId);

    expect(response.length).toBeGreaterThanOrEqual(1);
    expect(response[0].userId).toEqual(userId);
  });
});

describe('insertBookInfo', () => {
  const bookInfo: BookInfo = {
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '11111111'
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
    const result = await insertBookInfo(bookInfo);
    
    expect(result.status).toEqual(201);
  });
});