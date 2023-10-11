import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { IBooksGAPI } from "$lib/server/GoogleBooksAPI/serverManage";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import type { books_v1 } from "googleapis";

export class ClientBooksGAPI implements IBooksGAPI{
  async requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
    const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${query}`);
    const result: books_v1.Schema$Volumes = await response.json();
    
    return result;
  }

  async setBookInfoByISBN(bookInfo: IBookInfo): Promise<void> {
    if (!bookInfo.isbn_13) { throw new Error('ISBN is empty'); }

    //isbnで検索する
    const result = await this.requestBookInfo(`isbn:${bookInfo.isbn_13}`);
    if (result.items?.length === 0 || !result.items) { throw new Error('This books image was not found in GoogleBooksAPI'); }
  
    const volumeInfo = result.items[0].volumeInfo;
    bookInfo.imageUrl = volumeInfo?.imageLinks?.thumbnail!;
    bookInfo.pageCount = volumeInfo?.pageCount!;  
  }
}