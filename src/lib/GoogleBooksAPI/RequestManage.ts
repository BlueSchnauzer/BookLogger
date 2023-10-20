import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { books_v1 } from "googleapis";

/**指定した検索条件でGoogleBooksAPIにリクエストする */
export function requestBookInfo(queries: string[]): Promise<books_v1.Schema$Volumes>;
/**指定した検索条件でリクエストし、リソースを限定して取得する */
export function requestBookInfo(queries: string[], resource: string): Promise<books_v1.Schema$Volumes>;

export async function requestBookInfo(queries: string[], resource?: string): Promise<books_v1.Schema$Volumes> {
  let response: Response;
  
  if (!resource){
    response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}`);
  }
  else {
    response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}&fields=${resource}`);
  }

  const result: books_v1.Schema$Volumes = await response.json();
  
  return result;
}

/**GoogleBooksAPIにISBNでリクエストして書影データを取得、設定する。*/
export async function getThumbnailByIsbn(isbn_13: string): Promise<string> {
  if (!isbn_13) { throw new Error('ISBN is empty'); }

  //サムネイル以外は不要なのでリソースを指定
  const resource = 'items(volumeInfo/imageLinks/thumbnail)';
  const result = await requestBookInfo([`isbn:${isbn_13}`], resource);
  if (!result.items) { throw new Error('This book\'s information was not found in GoogleBooksAPI'); }

  return result.items[0].volumeInfo?.imageLinks?.thumbnail!;
}

