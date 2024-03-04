import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { status } from '$lib/customTypes';

/**書誌データの取得・保存を扱うリポジトリ */
export interface IBookInfoRepositories{
  /**書誌データを取得する */
  get(): Promise<BookInfo[]>;
  /**statusが引数と一致した書誌データを取得する */
  getByStatus(status: status): Promise<BookInfo[]>;
  /**直近で読んだ、書誌データを1件取得する */
  getRecent(): Promise<BookInfo[]>;
  /**書誌データから、pageHistoryのみを取得する */
  getPageHistory(): Promise<BookInfo[]>;
  /**書誌データを保存する */
  insert(bookInfo: BookInfo): Promise<Response>;
  /**書誌データを更新する */
  update(bookInfo: BookInfo, isCompleteReading: boolean): Promise<Response>;
  /**書誌データを削除する */
  delete(bookInfo: BookInfo): Promise<Response>;
  /**同様の書誌データが既に保存されているか */
  isDuplicate(keyId: string): Promise<boolean>;
}