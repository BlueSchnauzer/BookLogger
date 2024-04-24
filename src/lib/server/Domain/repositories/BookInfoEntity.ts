import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import type { PageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";

/**書誌データのEntityの取得や更新を扱うリポジトリ
 * 返却する値はEntityもしくはValueObject
 * UseCaseから呼び出され、APIルートからの戻り値をEntityに変換して返す。
 */
export interface IBookInfoEntityRepository {
  /**書誌データを取得する */
  get(): Promise<BookInfo[]>;
  /**statusが引数と一致した書誌データを取得する */
  getByStatus(status: Status): Promise<BookInfo[]>;
  /**直近で読んだ、書誌データを1件取得する */
  getRecent(): Promise<BookInfo[]>;
  /**書誌データから、pageHistoryのみを取得する */
  getPageHistory(): Promise<PageHistory[]>;
  /**書誌データを保存する */
  insert(bookInfo: BookInfo): Promise<Response>;
  /**書誌データを更新する */
  update(bookInfo: BookInfo, isCompleteReading: boolean): Promise<Response>;
  /**書誌データを削除する */
  delete(id: Id): Promise<Response>;
  /**同様の書誌データが既に保存されているか */
  isDuplicate(keyId: string): Promise<boolean>;
}