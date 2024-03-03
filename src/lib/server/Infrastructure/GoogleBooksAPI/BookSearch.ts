import type { IBookSearchRepositories } from "$lib/server/Domain/repositories/BookSearch";
import type { books_v1 } from "googleapis";

export class BookSearchGoogleBooksAPI implements IBookSearchRepositories {
  requestBookInfo(queries: string[], maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  requestBookInfoWithPartialResource(queries: string[], resource?: string | undefined): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  requestBookInfoByFuzzySearch(query: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  requestBookInfosByQueries(booktitle: string, author: string, isbn_13: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    throw new Error("Method not implemented.");
  }
  getThumbnailByIsbn(isbn_13: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

}