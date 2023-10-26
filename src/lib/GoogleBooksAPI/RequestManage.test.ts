import { describe, it, expect } from "vitest";
import { requestBookInfo, getThumbnailByIsbn, getBookInfosByQueries, requestBookInfoWithPartialResource } from "./RequestManage";
import type { BookInfo } from "$lib/server/models/BookInfo";
import { ObjectId } from "mongodb";


describe('requestBookInfo', () => {
  const bookInfo: BookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
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
    const result = await requestBookInfo([`isbn:${bookInfo.identifier?.isbn_13}`]);

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
    const result = await requestBookInfo([`isbn:${bookInfo.identifier?.isbn_13}`, `intitle:${bookInfo.title}`, `inauthor:${bookInfo.author[0]}`]);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });  

  it('検索結果が複数ある時に、取得数を制限できるか', async () => {
    const defaultCounts = await requestBookInfo([`inauthor:${bookInfo.author[0]}`]);
    expect(defaultCounts.items).toBeDefined();
    expect(defaultCounts.items?.length).toEqual(10);

    const twenty = await requestBookInfo([`inauthor:${bookInfo.author[0]}`], 20);
    expect(twenty.items).toBeDefined();
    expect(twenty.items?.length).toEqual(20);
  });

  it('検索結果が複数ある際に、ページングができるか', async () => {
    const pageOne = await requestBookInfo([`inauthor:${bookInfo.author[0]}`], 10, 0);
    expect(pageOne.totalItems).toBeGreaterThanOrEqual(11);
    const firstItem = pageOne.items![0].volumeInfo?.title;

    const pageTwo = await requestBookInfo([`inauthor:${bookInfo.author[0]}`], 10, 10);
    const eleventhItem = pageTwo.items![0].volumeInfo?.title;

    expect(firstItem).not.toEqual(eleventhItem);
  });
});

describe('requestBookInfoWithPartialResource', () => {
  const bookInfo: BookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
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

  it('リソースを指定して取得できるか', async () => {
    const result = await requestBookInfoWithPartialResource([`isbn:${bookInfo.identifier?.isbn_13}`], 'items(volumeInfo/imageLinks/thumbnail)');
    
    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.imageLinks?.thumbnail).toBeDefined();
    expect(result.items![0].volumeInfo?.imageLinks?.smallThumbnail).not.toBeDefined();
  });

  it('リソースを指定しない場合、全てのリソースが取得できるか', async () => {
    const result = await requestBookInfoWithPartialResource([`isbn:${bookInfo.identifier?.isbn_13}`]);
    
    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.imageLinks?.thumbnail).toBeDefined();
    expect(result.items![0].volumeInfo?.imageLinks?.smallThumbnail).toBeDefined();
  });
});

describe('getBookInfosByQueries', () => {
  const bookInfo: BookInfo = {
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
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

  it('タイトルを条件にして一致した書誌データを取得できるか',async () => {
    const result = await getBookInfosByQueries(bookInfo.title, '', '');

    //タイトル指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('著者名を条件にして一致した書誌データを取得できるか', async () => {
    const result = await getBookInfosByQueries('', bookInfo.author[0], '');

    //著者指定は複数取れるので、一致させずに1件でもあればOK
    expect(result.items).toBeDefined();
  });

  it('ISBNを条件にして一致した書誌データを取得できるか', async () => {
    const result = await getBookInfosByQueries('', '', bookInfo.identifier?.isbn_13!);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });
  
  it('複数条件で書誌データを取得できるか', async () => {
    const result = await getBookInfosByQueries(bookInfo.title, bookInfo.author[0], bookInfo.identifier?.isbn_13!);

    expect(result.items).toBeDefined();
    expect(result.items![0].volumeInfo?.title).toEqual(bookInfo.title);
  });  

  //rejectを確認
  it('queriesが無い場合にRejectされること', () => {
    getBookInfosByQueries('', '', '')
    .catch((e: Error) => {
      expect(e.message).toEqual('検索条件が入力されていません。');
    });
  });

  it('リクエスト結果が0件の際にRejectされること', () => {
    getBookInfosByQueries('', '', '0000')
    .catch((e: Error) => {
      expect(e.message).toEqual('検索条件に合う書誌情報が見つかりませんでした。');
    });
  })

});

describe('getThumbnailByIsbn', () => {
  const bookInfos: BookInfo[] = [{
    _id: new ObjectId('651451ed67241f439ce8a1af'),
    userId: 1,
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
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
      identifier: {},
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
      identifier: {},
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

  it('ISBNを条件にして書影を取得できること', async () => {
    const thumbnail = await getThumbnailByIsbn(bookInfos[0].identifier?.isbn_13!);

    expect(thumbnail).toBeTruthy();
  });

  it('ISBNを持っていない場合にRejectされること', async () => {
    await getThumbnailByIsbn(bookInfos[1].identifier?.isbn_13!)
    .catch((e: Error) => {
      expect(e.message).toEqual('ISBNが設定されていません。');
    });
  });

  it('リクエスト結果が0件の際にRejectされること', async () => {
    await getThumbnailByIsbn(bookInfos[2].identifier?.isbn_13!)
    .catch((e: Error) => {
      expect(e.message).toEqual('検索条件に合う書影が見つかりませんでした。');
    });
  });
});