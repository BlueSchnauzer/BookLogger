import type { books_v1 } from "googleapis";

export interface IBookSearchRepositories{
  /**指定した検索条件でGoogleBooksAPIにリクエストする 
   * @param queries 検索条件
   * @param [maxResults=10] 取得するアイテム数
   * @param [startIndex=0] 取得を開始するインデックス
  */
  requestBookInfo(queries: string[], maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes>;

  /**指定した検索条件でリクエストし、リソースを限定して取得する */
  requestBookInfoWithPartialResource(queries: string[], resource?: string): Promise<books_v1.Schema$Volumes>;

  /**(あいまい検索)検索条件を指定して書誌データを取得する */
  requestBookInfoByFuzzySearch(query: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes>;

  /**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
  requestBookInfosByQueries(booktitle: string, author: string, isbn_13: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes>;

  /**GoogleBooksAPIにISBNでリクエストして書影データを取得する
   * todo ISBNを持っていないデータもあるので代替処理が必要。
   */
  getThumbnailByIsbn(isbn_13: string): Promise<string>;
}