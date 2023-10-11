import { google, books_v1 } from "googleapis"
import type { IBookInfo } from "../models/BookInfo";

export interface IBooksGAPI {
  /**指定した検索条件でGoogleBooksAPIにリクエストする */
  requestBookInfo(query: string): Promise<books_v1.Schema$Volumes>
  /**GoogleBooksAPIにISBNでリクエストして書誌データを取得、設定する。*/
  setBookInfoByISBN(bookInfo: IBookInfo): Promise<void>
}

export class ServerBooksGAPI implements IBooksGAPI {
  private books: books_v1.Books

  constructor(){
    this.books = google.books({version: 'v1'});
  }

  async requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
    const response = await this.books.volumes.list({q: query});
    return response.data;
  }

  async setBookInfoByISBN(bookInfo: IBookInfo): Promise<void> {
    if (!bookInfo.isbn_13) { throw new Error('ISBN is empty'); }

    const result = await this.requestBookInfo(`isbn:${bookInfo.isbn_13}`);
    if (result.items?.length === 0 || !result.items) { throw new Error('This books image was not found in GoogleBooksAPI'); }

    const volumeInfo = result.items[0].volumeInfo;
    bookInfo.imageUrl = volumeInfo?.imageLinks?.thumbnail!;
    bookInfo.pageCount = volumeInfo?.pageCount!;
  }
}