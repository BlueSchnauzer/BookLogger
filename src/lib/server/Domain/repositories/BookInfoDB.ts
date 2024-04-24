import type MongoDBModel from "../Entities/MongoDBModel/BookInfo";
import type { status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import type { id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import type { pageHistory } from "../ValueObjects/BookInfo/PageHistory";

/**DBとの書誌データの取得・保存を扱うリポジトリ
 * 返却する値はDBモデルかプリミティブ型(のみを含んだ型)
 * SvelteのAPIルートから呼び出されることを想定しているので、
 * クラス形式のEntityではなく、プレーンオブジェクトのみを返す。
 */
export interface IBookInfoDBRepositories{
  /**書誌データを取得する */
  get(): Promise<MongoDBModel[]>;
  /**statusが引数と一致した書誌データを取得する */
  getByStatus(status: status): Promise<MongoDBModel[]>;
  /**直近で読んだ、書誌データを1件取得する */
  getRecent(): Promise<MongoDBModel[]>;
  /**書誌データから、pageHistoryのみを取得する */
  getPageHistory(): Promise<pageHistory[]>;
  /**書誌データを保存する */
  insert(bookInfo: MongoDBModel): Promise<Response>;
  /**書誌データを更新する */
  update(bookInfo: MongoDBModel, isCompleteReading: boolean): Promise<Response>;
  /**書誌データを削除する */
  delete(id: id): Promise<Response>;
  /**同様の書誌データが既に保存されているか */
  isDuplicate(keyId: string): Promise<boolean>;
}