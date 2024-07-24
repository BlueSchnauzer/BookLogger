import { PUBLIC_BOOKSAPI_LIST } from "$env/static/public";
import type { IBookSearchRepositories } from "$lib/server/Domain/Repositories/IBookSearch";
import type { books_v1 } from "googleapis";

export class BookSearchGoogleBooksAPI implements IBookSearchRepositories {
  async search(queries: string[], maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}&maxResults=${maxResults}&startIndex=${startIndex}`);
    const result: books_v1.Schema$Volumes = await response.json();

    return result;
  }

  async searchWithPartialResource(queries: string[], resource?: string | undefined): Promise<books_v1.Schema$Volumes> {
    const fields = resource ? `&fields=${resource}` : '';

    const response = await fetch(`${PUBLIC_BOOKSAPI_LIST}?q=${encodeURI(queries.join('+'))}${fields}`);
    const result: books_v1.Schema$Volumes = await response.json();

    return result;
  }

  async searchByFuzzyQuery(query: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    if (!query) { throw new Error('検索条件が入力されていません。'); }

    const fuzzyQuery: string[] = [];
    fuzzyQuery.push(query);

    const result = await this.search(fuzzyQuery, maxResults, startIndex);
    if (result.totalItems === 0 || !result.items) { throw new Error('検索条件に合う書誌情報が見つかりませんでした。'); }

    return result;
  }

  async searchByQueries(booktitle: string, author: string, isbn_13: string, maxResults: number, startIndex: number): Promise<books_v1.Schema$Volumes> {
    const queries: string[] = [];
    if (booktitle) { queries.push(`intitle:${booktitle}`); }
    if (author) { queries.push(`inauthor:${author}`); }
    if (isbn_13) { queries.push(`isbn:${isbn_13}`); }

    if (queries.length === 0) { throw new Error('検索条件が入力されていません。'); }

    const result = await this.search(queries, maxResults, startIndex);
    if (result.totalItems === 0 || !result.items) { throw new Error('検索条件に合う書誌情報が見つかりませんでした。'); }

    return result;
  }

  async getThumbnailByIsbn(isbn_13: string): Promise<string> {
    if (!isbn_13) { throw new Error('ISBNが設定されていません。'); }

    //サムネイル以外は不要なのでリソースを指定
    const resource = 'items(volumeInfo/imageLinks/thumbnail)';
    const result = await this.searchWithPartialResource([`isbn:${isbn_13}`], resource);
    if (!result.items) { throw new Error('検索条件に合う書影が見つかりませんでした。'); }

    return result.items[0].volumeInfo?.imageLinks?.thumbnail!;
  }
}