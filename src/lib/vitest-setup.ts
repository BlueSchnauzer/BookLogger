//マッチ関数を簡略化するために追加
import 'vitest-dom/extend-expect'
import type { BookInfo } from '$lib/server/models/BookInfo';
import { BookInfo as BookInfoEntity } from '$lib/server/Domain/Entities/BookInfo';
import type MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import { ObjectId } from 'mongodb'

export const firstId = new ObjectId('651451ed67241f439ce8a1af');
export const secondId = new ObjectId('651451ed67241f439ce8a1b0');
export const thirdId = new ObjectId('651451ed67241f439ce8a1b1');

const firstId_test = '651451ed67241f439ce8a1af';
const secondId_test = '651451ed67241f439ce8a1b0';
const thirdId_test = '651451ed67241f439ce8a1b1';


/**テスト用書誌データ(1件) */
export const getTestData = () => {
  const testData: BookInfo = {
    _id: firstId,
    userId: 'firstData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: 300,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです1'
  }

  return testData;
}

export const getEntityTestData = (): BookInfoEntity => {
  const modelData: MongoDBModel = {
    _id: firstId_test,
    userId: 'firstData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: 300,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      pageCount: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです1'
  }

  return new BookInfoEntity(modelData);
}

/**テスト用書誌データ(3件) */
export const getTestDatas = () => {
  const testDatas: BookInfo[] = [{
    _id: firstId,
    userId: 'firstData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: 300,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです1'
  },
  {
    _id: secondId,
    userId: 'secondData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-031316-6'
    },
    title: 'エピローグ',
    author: ['円城塔'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです1'
  },
  {
    _id: thirdId,
    userId: 'thirdData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-16-791019-8'
    },
    title: 'プロローグ',
    author: ['円城塔'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです2'
  }]

  return testDatas;
}

export const getEntityTestDatas = (): BookInfoEntity[] => {
  const modelDatas: BookInfo[] = [{
    _id: firstId_test,
    userId: 'firstData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-120051-9'
    },
    title: 'わたしを離さないで',
    author: ['イシグロカズオ'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: 300,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです1'
  },
  {
    _id: secondId_test,
    userId: 'secondData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-15-031316-6'
    },
    title: 'エピローグ',
    author: ['円城塔'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです1'
  },
  {
    _id: thirdId_test,
    userId: 'thirdData',
    isVisible: true,
    identifier: {
      isbn_13: '978-4-16-791019-8'
    },
    title: 'プロローグ',
    author: ['円城塔'],
    thumbnail: '',
    createDate: new Date,
    updateDate: new Date,
    pageCount: -1,
    pageHistory: [{
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 0
    }],
    isFavorite: false,
    status: 'wish',
    memorandum: 'メモです2'
  }]

  return modelDatas.map(item => new BookInfoEntity(item as MongoDBModel));
}