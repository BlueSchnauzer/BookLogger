import { BookInfoView } from "$lib/client/Application/Views/bookInfo";
import type { BookInfo } from "$lib/client/Domain/Entities/BookInfo";
import { PageHistory } from "$lib/client/Domain/ValueObjects/BookInfo/PageHistory";
import { Status } from "$lib/client/Domain/ValueObjects/BookInfo/Status";
import { convertReadingDateToDate } from "$lib/client/Utils/date";
import { validateReadingCount, validateReadingDate } from "$lib/client/Utils/validation";

export class BookInfoEntityUseCase {
  constructor(private _entity: BookInfo) { }

  public getEntity() {
    return this._entity;
  }

  public setPageCount(pageCount: number) {
    this._entity.pageCount = pageCount;
    return new BookInfoView(this._entity);
  }

  public changeFavorite() {
    this._entity.changeFavorite();
    return new BookInfoView(this._entity);
  }

  public setStatus(status: Status) {
    this._entity.setStatus(status);
    return new BookInfoView(this._entity);
  }

  public setMemorandum(memorandum: string) {
    this._entity.memorandum = memorandum;
    return new BookInfoView(this._entity);
  }

  public addPageHistory(readingDate: string, readingCount: number) {
    const isValidDate = validateReadingDate(readingDate);
    const isValidCount = validateReadingCount(readingCount, this._entity.pageCount);
    if (!isValidDate || !isValidCount) { return { isSuccess: false, message: '' }; }

    const item = new PageHistory({
      date: convertReadingDateToDate(readingDate),
      pageCount: readingCount
    });

    let message = '';
    let status = undefined;
    if (this._entity.status.value === 'wish' && this._entity.pageHistories?.length === 1) {
      status = new Status('reading');
      message = 'ステータスを「読んでいる本」に変更しました。';
    } else if (this._entity.status.value !== 'complete' && readingCount === this._entity.pageCount) {
      status = new Status('complete');
      message = 'ステータスを「読み終わった本」に変更しました。';
    }

    this._entity.addPageHistory(item);
    if (status) { this._entity.setStatus(status); }

    return { isSuccess: true, message, view: new BookInfoView(this._entity) };
  }
}