/**書誌データの検索を行うリポジトリ */
export interface IBookSearchRepository<T> {
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
}