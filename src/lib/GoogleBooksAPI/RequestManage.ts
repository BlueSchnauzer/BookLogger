import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { BookInfo } from "$lib/server/models/BookInfo";
import type { books_v1 } from "googleapis";

/**指定した検索条件でGoogleBooksAPIにリクエストする */
export async function requestBookInfo(queries: string[]): Promise<books_v1.Schema$Volumes> {
  const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}`);
  const result: books_v1.Schema$Volumes = await response.json();
  
  return result;
}

/**GoogleBooksAPIにISBNでリクエストして書誌データを取得、設定する。*/
export async function getThumbnailByIsbn(isbn_13: string): Promise<string> {
  if (!isbn_13) { throw new Error('ISBN is empty'); }

  const result = await requestBookInfo([`isbn:${isbn_13}`]);
  if (result.items?.length === 0 || !result.items) { throw new Error('This book\'s information was not found in GoogleBooksAPI'); }

  return result.items[0].volumeInfo?.imageLinks?.thumbnail!;
}

