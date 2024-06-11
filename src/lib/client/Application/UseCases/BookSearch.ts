import type { IBookSearchRepositories } from "$lib/server/Domain/repositories/BookSearch";
import type { books_v1 } from "googleapis";

/**書誌データの操作を管理するUseCase */
export class BookSearchGoogleBooksAPIUseCase {
  constructor(private readonly repos: IBookSearchRepositories) { }

  /**(あいまい検索)検索条件を指定して書誌データを取得する */
  public async searcyByFuzzyQuery(query: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    return await this.repos.searchByFuzzyQuery(query, maxResults, startIndex);
  }

  /**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
  public async searchByQueries(booktitle: string, author: string, isbn_13: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    return await this.repos.searchByQueries(booktitle, author, isbn_13, maxResults, startIndex);
  }
}