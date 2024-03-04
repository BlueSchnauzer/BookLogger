import type { BookInfo } from "../Entities/BookInfo";

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
  getRecent(): Promise<BookInfo>;
  /**1週間に読んだページ数を取得する */
  getHistory(): Promise<Map<string, number>>;
  /**書誌データを保存する */
  post(bookInfo: BookInfo): Promise<boolean>;
  /**書誌データを更新する */
  put(bookInfo: BookInfo): Promise<boolean>;
  /**書誌データを削除する 
   * 一旦BookInfoのidを取る
  */
  delete(bookInfo: BookInfo): Promise<boolean>
}