import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import type { books_v1 } from "googleapis";

/**GoogleBooksAPIへのリクエストを扱う */
export class BooksGAPI{
  /**指定した検索条件でGoogleBooksAPIにリクエストする */
  async requestBookInfo(queries: string[]): Promise<books_v1.Schema$Volumes> {
    const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}`);
    const result: books_v1.Schema$Volumes = await response.json();
    
    return result;
  }

  /**GoogleBooksAPIにISBNでリクエストして書誌データを取得、設定する。*/
  async setBookInfoByISBN(bookInfo: IBookInfo): Promise<void> {
    if (!bookInfo.isbn_13) { throw new Error('ISBN is empty'); }

    const result = await this.requestBookInfo([`isbn:${bookInfo.isbn_13}`]);
    if (result.items?.length === 0 || !result.items) { throw new Error('This book\'s information was not found in GoogleBooksAPI'); }

    const volumeInfo = result.items[0].volumeInfo;
    bookInfo.imageUrl = volumeInfo?.imageLinks?.thumbnail!;
    bookInfo.pageCount = volumeInfo?.pageCount!;
  }
}