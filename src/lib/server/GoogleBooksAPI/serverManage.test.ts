import { describe, it, expect } from "vitest";
import { ServerBooksGAPI } from "./serverManage";
import type { IBookInfo } from "../models/BookInfo";
import { ObjectId } from "mongodb";

describe('requestBookInfo', () => {
  const booksGapi = new ServerBooksGAPI();
  const bookInfo: IBookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    isbn_13: '978-4-15-120051-9',
    title: 'わたしを離さないで',
    imageUrl: '',
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

  it('ISBNを条件にして一致した書誌データを取得できるか', async () => {
    const result = await booksGapi.requestBookInfo(`isbn:${bookInfo.isbn_13}`);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });
  
  it('タイトルを条件にして一致した書誌データを取得できるか',async () => {
    const result = await booksGapi.requestBookInfo(`intitle:${bookInfo.title}`);

    //タイトル指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('著者名を条件にして一致した書誌データを取得できるか', async () => {
    const result = await booksGapi.requestBookInfo('inauthor:イシグロカズオ');

    //著者指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

});

describe('setBookInfoByISBN', () => {
  const booksGapi = new ServerBooksGAPI();
  const bookInfo: IBookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    isbn_13: '978-4-15-120051-9',
    title: 'わたしを離さないで',
    imageUrl: '',
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

  it('bookInfoが持つISBNを条件にして書誌データの取得と、設定ができること', async () => {
    await booksGapi.setBookInfoByISBN(bookInfo);

    expect(bookInfo.imageUrl).toBeTruthy();
    expect(bookInfo.pageCount).not.toBe(-1);
  });

  //他の観点はServer側でテスト済み
});