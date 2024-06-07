import type { IBookSearchRepositories } from "$lib/server/Domain/repositories/BookSearch";
import { BookSearchGoogleBooksAPIUseCase } from "$lib/client/Application/UseCases/BookSearch";
import type { books_v1 } from "googleapis";

export class BookSearchView {
  private readonly _usecase: BookSearchGoogleBooksAPIUseCase;

  constructor(private readonly repos: IBookSearchRepositories) {
    this._usecase = new BookSearchGoogleBooksAPIUseCase(repos);
  }  
}