import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { books_v1 } from "googleapis";

/**指定した検索条件でGoogleBooksAPIにリクエストする 
 * @param queries 検索条件
 * @param [maxResults=10] 取得するアイテム数
 * @param [startIndex=0] 取得を開始するインデックス
*/
export async function requestBookInfo(queries: string[], maxResults = 10, startIndex = 0): Promise<books_v1.Schema$Volumes> {
  const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}&maxResults=${maxResults}&startIndex=${startIndex}`);
  const result: books_v1.Schema$Volumes = await response.json();
  
  return result;
}

/**指定した検索条件でリクエストし、リソースを限定して取得する */
export async function requestBookInfoWithPartialResource(queries: string[], resource?: string): Promise<books_v1.Schema$Volumes>{
  const fields = resource ? `&fields=${resource}` : '';

  const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}${fields}`);
  const result: books_v1.Schema$Volumes = await response.json();
  
  return result;
}

/**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
export async function getBookInfosByQueries(booktitle: string, author: string, isbn_13: string): Promise<books_v1.Schema$Volumes>{
  const queries: string[] = [];
  if (booktitle) { queries.push(`intitle:${booktitle}`); }
  if (author) { queries.push(`inauthor:${author}`); }
  if (isbn_13) { queries.push(`isbn:${isbn_13}`); }

  if (queries.length === 0) { throw new Error('検索条件が入力されていません。'); }

  const result = await requestBookInfo(queries);
  if (result.totalItems === 0 || !result.items) { throw new Error('検索条件に合う書誌情報が見つかりませんでした。'); }

  return result;
}

/**GoogleBooksAPIにISBNでリクエストして書影データを取得する */
export async function getThumbnailByIsbn(isbn_13: string): Promise<string> {
  if (!isbn_13) { throw new Error('ISBNが設定されていません。'); }

  //サムネイル以外は不要なのでリソースを指定
  const resource = 'items(volumeInfo/imageLinks/thumbnail)';
  const result = await requestBookInfoWithPartialResource([`isbn:${isbn_13}`], resource);
  if (!result.items) { throw new Error('検索条件に合う書影が見つかりませんでした。'); }

  return result.items[0].volumeInfo?.imageLinks?.thumbnail!;
}