//マッチ関数を簡略化するために追加
import 'vitest-dom/extend-expect'
import type { BookInfo } from '$lib/server/models/BookInfo'
import { ObjectId } from 'mongodb'

export const firstId = new ObjectId('a123456789b123456789c123');
export const secondId = new ObjectId('d123456789e123456789f123');
export const thirdId = new ObjectId('A123456789B123456789C123');

/**テスト用書誌データ(1件) */
export const oneBookInfo: BookInfo = {
  _id: firstId,
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
  pageCount: 300,
  history: [{
    date: new Date,
    currentPage: 0
  }],
  isFavorite: false,
  status: 'wish',
  memorandum: 'メモです1'
}

/**テスト用書誌データ(3件) */
export const threeBookInfos: BookInfo[] = [{
  _id: firstId,
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
  pageCount: 300,
  history: [{
    date: new Date,
    currentPage: 0
  }],
  isFavorite: false,
  status: 'wish',
  memorandum: 'メモです1'
},
{
  _id: secondId,
  userId: 1,
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
  history: [{
    date: new Date,
    currentPage: 0
  }],
  isFavorite: false,
  status: 'wish',
  memorandum: 'メモです1'
},
{
  _id: thirdId,
  userId: 1,
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
  history: [{
    date: new Date,
    currentPage: 0
  }],
  isFavorite: false,
  status: 'wish',
  memorandum: 'メモです2'
}]