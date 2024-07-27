/**書誌データの検索を行うリポジトリ */
export interface IBookSearchRepository<T> {
  /**指定した検索条件で書誌APIにリクエストする
   * @param queries 検索条件
   * @param maxResults 取得件数
   * @param startIndex データ取得開始位置
   */
  search(queries: string[], maxResults: number, startIndex: number): Promise<T>;

  /**指定した検索条件でリクエストし、リソースを限定して取得する */
  searchWithPartialResource(queries: string[], resource?: string): Promise<T>;

  /**(あいまい検索)検索条件を指定して書誌データを取得する
   * @param query 検索条件
   * @param maxResults 取得件数
   * @param startIndex データ取得開始位置
   */
  searchByFuzzyQuery(query: string, maxResults: number, startIndex: number): Promise<T>;

  /**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する
   * @param maxResults 取得件数
   * @param startIndex データ取得開始位置
   */
  searchByQueries(booktitle: string, author: string, isbn_13: string, maxResults: number, startIndex: number): Promise<T>;

  /**ISBNでリクエストして書影データを取得する */
  getThumbnailByIsbn(isbn_13: string): Promise<string>;
}