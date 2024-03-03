import type { status } from "$lib/customTypes";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { IBookInfoRepositories } from "$lib/server/Domain/repositories/BookInfo";
import type { ObjectId } from "mongodb";
import type { bookInfosCollection } from "./MongoDBHelper";

export class BookInfoMongoDB implements IBookInfoRepositories {
  private readonly _collection: bookInfosCollection;
  private readonly _userId: string;

  constructor (collection: bookInfosCollection, userId: string) {
    this._collection = collection;
    this._userId = userId;
  }

  getBookInfo(): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  getRecentBookInfo(): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  getBookInfoWithOnlyPageHistory(): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  getBookInfoByStatus(status: status): Promise<BookInfo[]> {
    throw new Error("Method not implemented.");
  }
  insertBookInfo(bookInfo: BookInfo): Promise<Response> {
    throw new Error("Method not implemented.");
  }
  isDuplicateBookInfo(keyId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  updateBookInfo(bookInfo: BookInfo, isCompleteBook: boolean): Promise<Response> {
    throw new Error("Method not implemented.");
  }
  deleteBookInfo(bookInfo: BookInfo): Promise<Response> {
    throw new Error("Method not implemented.");
  }

}