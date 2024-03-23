import type { books_v1 } from "googleapis";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";

export interface IBookInfoAPIRequestRepository {
  /**登録済みの全書誌データ取得する */
  get(): Promise<BookInfo[]>;
  /**読みたい本ステータスの書誌データを取得する */
  getWish(): Promise<BookInfo[]>;
  /**読んでいる本ステータスの書誌データを取得する */
  getReading(): Promise<BookInfo[]>;
  /**読み終わった本ステータスの書誌データを取得する */
  getComplete(): Promise<BookInfo[]>;
  /**直近で読んだ書誌データを取得する */
  getRecent(): Promise<BookInfo | undefined>;
  /**1週間に読んだページ数を取得する */
  getHistory(): Promise<Map<string, number> | undefined>;
  /**書誌データを保存する */
  post(postDate: books_v1.Schema$Volumes): Promise<{isSuccess: boolean, message: string}>;
  /**書誌データを更新する */
  put(bookInfo: BookInfo, isComplete: boolean): Promise<{isSuccess: boolean, message: string}>;
  /**書誌データを削除する 
   * 一旦BookInfoのidを取る
  */
  delete(bookInfo: BookInfo): Promise<{isSuccess: boolean, message: string}>
}