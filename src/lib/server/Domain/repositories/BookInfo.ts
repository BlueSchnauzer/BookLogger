import type { bookInfosCollection } from "$lib/server/Infrastructure/MongoDB/MongoDBHelper";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { status } from '$lib/customTypes';
import type { ObjectId } from "mongodb";

export interface IBookInfoRepositories{
  /**ユーザIDに紐づいた書誌データを取得する */
  getBookInfo(collection: bookInfosCollection, userId: string): Promise<BookInfo[]>;
  /**直近で読んだ、ユーザIDに紐づいた書誌データを1件取得する */
  getRecentBookInfo(collection: bookInfosCollection, userId: string): Promise<BookInfo[]>;
  /**ユーザIDに紐づいた書誌データから、pageHistoryのみを取得する */
  getBookInfoWithOnlyPageHistory(collection: bookInfosCollection, userId: string): Promise<BookInfo[]>;
  /**statusが引数と一致し、ユーザIDに紐づいた書誌データを取得する */
  getBookInfoByStatus(collection: bookInfosCollection, userId: string, status: status): Promise<BookInfo[]>;
  /**書誌データを保存する */
  insertBookInfo(collection: bookInfosCollection, bookInfo: BookInfo): Promise<Response>;
  /**同様の書誌データが既に保存されているか */
  isDuplicateBookInfo(collection: bookInfosCollection, userId: string, gapiId: string): Promise<boolean>;
  /**書誌データを更新する */
  updateBookInfo(collection: bookInfosCollection, bookInfo: BookInfo, isComplete: boolean): Promise<Response>;
  /**書誌データを削除する */
  deleteBookInfo(collection: bookInfosCollection, _id: ObjectId): Promise<Response>;
}