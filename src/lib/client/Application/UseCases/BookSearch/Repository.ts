import type { IBookSearchRepository } from "$lib/client/Domain/Repositories/IBookSearch";
import { BookSearchView } from "$lib/client/Application/Views/BookSearch";
import { BookSearchGoogleBooksAPI } from "$lib/client/Infrastructure/GoogleBooksAPI/BookSearch";
import type { BookSearchResultType } from "$lib/client/Application/Interface";

/**書誌データの操作を管理するUseCase */
export class BookSearchGoogleBooksAPIUseCase<T extends BookSearchResultType> {
  constructor(private readonly repos: IBookSearchRepository<T>) { }

  /**(あいまい検索)検索条件を指定して書誌データを取得する */
  public async searcyByFuzzyQuery(query: string, maxResults = 10, startIndex = 0): Promise<BookSearchView<T>> {
    const response = await this.repos.searchByFuzzyQuery(query, maxResults, startIndex);
    return new BookSearchView(response);
  }

  /**書名、著者名とISBNのいずれか、または全てを指定して書誌データを取得する */
  public async searchByQueries(booktitle: string, author: string, isbn_13: string, maxResults = 10, startIndex = 0): Promise<BookSearchView<T>> {
    const response = await this.repos.searchByQueries(booktitle, author, isbn_13, maxResults, startIndex);
    return new BookSearchView(response);
  }
}