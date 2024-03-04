import type { books_v1 } from "googleapis";

/**書誌データの検索を行うリポジトリ
 * GoogleBooksAPIに特化してしまっているので、汎用的な実装にはなっていない。
 */
export interface IBookSearchRepositories{
  /**指定した検索条件で書誌APIにリクエストする */
  search(queries: string[]): Promise<books_v1.Schema$Volumes>;
  /**指定した検索条件でリクエストし、リソースを限定して取得する */
  searchWithPartialResource(queries: string[], resource?: string): Promise<books_v1.Schema$Volumes>;
  /**(あいまい検索)検索条件を指定して書誌データを取得する */
  searchByFuzzySearch(query: string): Promise<books_v1.Schema$Volumes>;
  /**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
  searchByQueries(booktitle: string, author: string, isbn_13: string): Promise<books_v1.Schema$Volumes>;
  /**ISBNでリクエストして書影データを取得する */
  getThumbnailByIsbn(isbn_13: string): Promise<string>;
}