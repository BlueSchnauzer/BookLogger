import type { IBookSearchRepositories } from "$lib/server/Domain/repositories/BookSearch";
import { BookSearchGoogleBooksAPIUseCase } from "$lib/client/Application/UseCases/BookSearch";
import type { books_v1 } from "googleapis";

export class BookSearchView {
  private readonly _usecase: BookSearchGoogleBooksAPIUseCase;

  constructor(private readonly repos: IBookSearchRepositories) {
    this._usecase = new BookSearchGoogleBooksAPIUseCase(repos);
  }  

  /**Usecaseを呼び出してあいまい検索を行う */
  public async searcyByFuzzyQuery(query: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    return await this._usecase.searcyByFuzzyQuery(query, maxResults, startIndex);
  }

  /**Usecaseを呼び出して詳細検索を行う */
  public async searchByQueries(booktitle: string, author: string, isbn_13: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    return await this._usecase.searchByQueries(booktitle, author, isbn_13, maxResults, startIndex);
  }
}