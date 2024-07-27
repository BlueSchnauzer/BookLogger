import { BookInfo } from "$lib/client/Domain/Entities/BookInfo";
import type { IBookInfoModel } from '$lib/client/Domain/Entities/MongoDB/IBookInfoModel';
import type { IBookInfoEntityRepository } from "$lib/client/Domain/Repositories/IBookInfoEntity";
import type { id } from "$lib/client/Domain/ValueObjects/BookInfo/Id";
import { PageHistory, type pageHistory } from "$lib/client/Domain/ValueObjects/BookInfo/PageHistory";
import type { status } from "$lib/client/Domain/ValueObjects/BookInfo/Status";
import type { books_v1 } from "googleapis";

export class BookInfoEntityResource implements IBookInfoEntityRepository {
  private readonly requestUrl = '/api/bookinfo';

  async get(): Promise<BookInfo[]> {
    const response = await fetch(this.requestUrl);
    const dbModels = await response.json() as IBookInfoModel[];

    return dbModels.map(item => BookInfo.fromDBModel(item));
  }

  async getByStatus(status: status): Promise<BookInfo[]> {
    //eg. '/api/bookinfo?type=wish'
    const response = await fetch(`${this.requestUrl}?type=${status}`);
    const dbModels = await response.json() as IBookInfoModel[];

    return dbModels.map(item => BookInfo.fromDBModel(item));
  }

  async getRecent(): Promise<BookInfo | undefined> {
    const response = await fetch(`${this.requestUrl}?type=recent`);
    const dbModel = await response.json() as IBookInfoModel;

    return dbModel ? BookInfo.fromDBModel(dbModel) : undefined;
  }

  async getPageHistory(): Promise<Array<PageHistory[]>> {
    const response = await fetch(`${this.requestUrl}/history`);
    const pageHistory = await response.json() as Array<pageHistory[]>;

    return pageHistory.map(item =>
      item.map(pageHistory => new PageHistory(pageHistory))
    );
  }

  async insert(item: books_v1.Schema$Volumes): Promise<Response> {
    return await fetch(this.requestUrl, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: { 'Content-type': 'application/json' }
    });
  }

  async update(bookInfo: BookInfo, isCompleteReading: boolean): Promise<Response> {
    return await fetch(this.requestUrl, {
      method: 'PUT',
      body: JSON.stringify({ bookInfo, isCompleteReading }),
      headers: { 'Content-type': 'application/json' }
    });
  }

  async delete(id: id): Promise<Response> {
    return await fetch(this.requestUrl, {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: { 'Content-type': 'application/json' }
    });
  }
}