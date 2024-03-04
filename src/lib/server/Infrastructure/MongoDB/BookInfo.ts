import type { status } from "$lib/customTypes";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { IBookInfoRepositories } from "$lib/server/Domain/repositories/BookInfo";
import type { bookInfosCollection } from "./MongoDBHelper";

/**MongoDBでの書誌データ操作を管理する */
export class BookInfoMongoDB implements IBookInfoRepositories {
  private readonly _collection: bookInfosCollection;
  private readonly _userId: string;

  /**
   * MongoDB接続用コンストラクタ
   * @param collection MongoDBのBookInfoコレクションへの接続情報
   * @param userId 操作対象のUserId
   */
  constructor (collection: bookInfosCollection, userId: string) {
    this._collection = collection;
    this._userId = userId;
  }
  get(): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  getByStatus(status: status): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  getRecent(): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  getPageHistory(): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  insert(bookInfo: BookInfo): Promise<Response> {
    throw new Error("Method not implemented.");
  }
  update(bookInfo: BookInfo, isCompleteReading: boolean): Promise<Response> {
    throw new Error("Method not implemented.");
  }
  delete(bookInfo: BookInfo): Promise<Response> {
    throw new Error("Method not implemented.");
  }
  isDuplicate(keyId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}