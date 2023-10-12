import { google, books_v1 } from "googleapis"
import { AbstractBooksGAPI } from "$lib/GoogleBooksAPI/clientManage";

export class ServerBooksGAPI extends AbstractBooksGAPI {
  private books: books_v1.Books

  constructor(){
    super();
    this.books = google.books({version: 'v1'});
  }

  async requestBookInfo(query: string): Promise<books_v1.Schema$Volumes> {
    const response = await this.books.volumes.list({q: query});
    return response.data;
  }
}