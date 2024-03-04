import type { IBookSearchRepositories } from "$lib/server/Domain/repositories/BookSearch";
import type { books_v1 } from "googleapis";

export class BookSearchGoogleBooksAPI implements IBookSearchRepositories {
  search(queries: string[]): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  searchWithPartialResource(queries: string[], resource?: string | undefined): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  searchByFuzzySearch(query: string): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  searchByQueries(booktitle: string, author: string, isbn_13: string): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  getThumbnailByIsbn(isbn_13: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}