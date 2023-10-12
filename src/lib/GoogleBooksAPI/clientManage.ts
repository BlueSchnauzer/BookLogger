import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import type { books_v1 } from "googleapis";

/**サーバー・クライアント用のGoogleBooksAPIへのリクエストを扱う */
export abstract class AbstractBooksGAPI{
  constructor(){}

  /**指定した検索条件でGoogleBooksAPIにリクエストする */
  abstract requestBookInfo(query: string): Promise<books_v1.Schema$Volumes>;

  /**GoogleBooksAPIにISBNでリクエストして書誌データを取得、設定する。*/
  async setBookInfoByISBN(bookInfo: IBookInfo): Promise<void> {
    if (!bookInfo.isbn_13) { throw new Error('ISBN is empty'); }

    const result = await this.requestBookInfo(`isbn:${bookInfo.isbn_13}`);
    if (result.items?.length === 0 || !result.items) { throw new Error('This book\'s information was not found in GoogleBooksAPI'); }

    const volumeInfo = result.items[0].volumeInfo;
    bookInfo.imageUrl = volumeInfo?.imageLinks?.thumbnail!;
    bookInfo.pageCount = volumeInfo?.pageCount!;
  }
}

export class ClientBooksGAPI extends AbstractBooksGAPI {
  async requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
    const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${query}`);
    const result: books_v1.Schema$Volumes = await response.json();
    
    return result;
  }
}