import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { IBookInfo } from "$lib/server/models/BookInfo";
import type { books_v1 } from "googleapis";

/**指定した検索条件でGoogleBooksAPIにリクエストする */
async function requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
  const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${query}`);
  const volumes: books_v1.Schema$Volumes = await response.json();
  
  return volumes;
}

/**GoogleBooksAPIに書影をリクエストする*/
export async function getBookInfo(bookInfo: IBookInfo): Promise<string> {
  if (bookInfo.imageUrl) { return bookInfo.imageUrl; }
  if (!bookInfo.isbn_13) { throw new Error('ISBN is empty'); }

  //isbnで検索する
  const result = await requestBookInfo(`isbn:${bookInfo.isbn_13}`);
  if (result.items?.length === 0 || !result.items) { throw new Error('This books image was not found in GoogleBooksAPI'); }

  const volumeInfo = result.items[0].volumeInfo;
  bookInfo.imageUrl = volumeInfo?.imageLinks?.thumbnail!;
  bookInfo.pageCount = volumeInfo?.pageCount!;

  if (!bookInfo.imageUrl) { throw new Error('This books image was not found in GoogleBooksAPI'); }

  return bookInfo.imageUrl;
}
