import { describe, it, expect } from "vitest";
import { requestBookInfo, setBookInfoByISBN } from "./RequestManage";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import { ObjectId } from "mongodb";


describe('requestBookInfo', () => {
  const bookInfo: IBookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    isbn_13: '978-4-15-120051-9',
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
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

  it('ISBNを条件にして一致した書誌データを取得できるか', async () => {
    const result = await requestBookInfo([`isbn:${bookInfo.isbn_13}`]);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });
  
  it('タイトルを条件にして一致した書誌データを取得できるか',async () => {
    const result = await requestBookInfo([`intitle:${bookInfo.title}`]);

    //タイトル指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('著者名を条件にして一致した書誌データを取得できるか', async () => {
    const result = await requestBookInfo([`inauthor:${bookInfo.author[0]}`]);

    //著者指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('複数条件で書誌データを取得できるか', async () => {
    const result = await requestBookInfo([`isbn:${bookInfo.isbn_13}`, `intitle:${bookInfo.title}`, 'inauthor:イシグロカズオ']);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });
});

describe('setBookInfoByISBN', () => {
  const bookInfos: IBookInfo[] = [{
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    isbn_13: '978-4-15-120051-9',
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
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
  },
  {
      _id: new ObjectId('651451ed67241f439ce8a1af'),
      userId: 1,
      isVisible: true,
      isbn_13: '',
      title: 'タイトル無し',
      author: [''],
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
      memorandum: ''
  },
  {
      _id: new ObjectId('651451ed67241f439ce8a1af'),
      userId: 1,
      isVisible: true,
      isbn_13: '0000',
      title: 'タイトル無し',
      author: [''],
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
      memorandum: ''
  }]

  it('bookInfoが持つISBNを条件にして書誌データの取得と、設定ができること', async () => {
    await setBookInfoByISBN(bookInfos[0]);

    expect(bookInfos[0].thumbnail).toBeTruthy();
    expect(bookInfos[0].pageCount).not.toBe(-1);
  });

  it('ISBNを持っていない場合にRejectされること', async () => {
    await setBookInfoByISBN(bookInfos[1])
    .catch((e: Error) => {
      expect(e.message).toEqual('ISBN is empty');
    });
  });

  it('リクエスト結果が0件の際にRejectされること', async () => {
    await setBookInfoByISBN(bookInfos[2])
    .catch((e: Error) => {
      expect(e.message).toEqual('This book\'s information was not found in GoogleBooksAPI');
    });
  });
});