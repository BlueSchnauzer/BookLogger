import { describe, it, expect } from "vitest";
import { BooksGAPI } from "./RequestManage";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import { ObjectId } from "mongodb";


describe('requestBookInfo', () => {
  const booksGapi = new BooksGAPI();
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
    const result = await booksGapi.requestBookInfo([`isbn:${bookInfo.isbn_13}`]);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });
  
  it('タイトルを条件にして一致した書誌データを取得できるか',async () => {
    const result = await booksGapi.requestBookInfo([`intitle:${bookInfo.title}`]);

    //タイトル指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('著者名を条件にして一致した書誌データを取得できるか', async () => {
    const result = await booksGapi.requestBookInfo(['inauthor:イシグロカズオ']);

    //著者指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('複数条件で書誌データを取得できるか', async () => {
    const result = await booksGapi.requestBookInfo([`isbn:${bookInfo.isbn_13}`, `intitle:${bookInfo.title}`, 'inauthor:イシグロカズオ']);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });
});

describe('setBookInfoByISBN', () => {
  const booksGapi = new BooksGAPI();
  const bookInfos: IBookInfo[] = [{
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
  },
  {
      _id: new ObjectId('651451ed67241f439ce8a1af'),
      userId: 1,
      isVisible: true,
      isbn_13: '',
      title: 'タイトル無し',
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
      memorandum: ''
  },
  {
      _id: new ObjectId('651451ed67241f439ce8a1af'),
      userId: 1,
      isVisible: true,
      isbn_13: '0000',
      title: 'タイトル無し',
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
      memorandum: ''
  }]

  it('bookInfoが持つISBNを条件にして書誌データの取得と、設定ができること', async () => {
    await booksGapi.setBookInfoByISBN(bookInfos[0]);

    expect(bookInfos[0].imageUrl).toBeTruthy();
    expect(bookInfos[0].pageCount).not.toBe(-1);
  });

  it('ISBNを持っていない場合にRejectされること', async () => {
    await booksGapi.setBookInfoByISBN(bookInfos[1])
    .catch((e: Error) => {
      expect(e.message).toEqual('ISBN is empty');
    });
  });

  it('リクエスト結果が0件の際にRejectされること', async () => {
    await booksGapi.setBookInfoByISBN(bookInfos[2])
    .catch((e: Error) => {
      expect(e.message).toEqual('This book\'s information was not found in GoogleBooksAPI');
    });
  });
});