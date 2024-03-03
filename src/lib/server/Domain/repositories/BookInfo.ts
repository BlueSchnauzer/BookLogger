import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { status } from '$lib/customTypes';

export interface IBookInfoRepositories{
  /**ユーザIDに紐づいた書誌データを取得する */
  getBookInfo(): Promise<BookInfo[]>;
  /**直近で読んだ、ユーザIDに紐づいた書誌データを1件取得する */
  getRecentBookInfo(): Promise<BookInfo[]>;
  /**ユーザIDに紐づいた書誌データから、pageHistoryのみを取得する */
  getBookInfoWithOnlyPageHistory(): Promise<BookInfo[]>;
  /**statusが引数と一致し、ユーザIDに紐づいた書誌データを取得する */
  getBookInfoByStatus(status: status): Promise<BookInfo[]>;
  /**書誌データを保存する */
  insertBookInfo(bookInfo: BookInfo): Promise<Response>;
  /**同様の書誌データが既に保存されているか */
  isDuplicateBookInfo(keyId: string): Promise<boolean>;
  /**書誌データを更新する */
  updateBookInfo(bookInfo: BookInfo, isCompleteBook: boolean): Promise<Response>;
  /**書誌データを削除する */
  deleteBookInfo(bookInfo: BookInfo): Promise<Response>;
}