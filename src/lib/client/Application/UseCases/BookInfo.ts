import { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { PageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";
import type { IBookInfoEntityRepository } from "$lib/server/Domain/repositories/BookInfoEntity";
import type { books_v1 } from "googleapis";
import { BookInfoView } from "$lib/client/Application/Views/BookInfo";
import { validateReadingCount, validateReadingDate } from "$lib/client/Utils/validation";
import { convertReadingDateToDate } from "$lib/client/Utils/date";
import { getPageHistoryMapInCurrentWeek } from "$lib/client/Utils/pageHistory";

export interface bookInfoChangeResponse {
  isSuccess: boolean,
  message: string
}

/**書誌データの操作を管理するUseCase */
export class BookInfoUseCase {
  constructor(private readonly repos: IBookInfoEntityRepository) { }

  /**登録済みの全書誌データ取得する */
  public async get(): Promise<BookInfoView[]> {
    const bookInfos = await this.repos.get();
    return bookInfos.map(item => new BookInfoView(item));
  }

  /**読みたい本ステータスの書誌データを取得する */
  public async getWish(): Promise<BookInfoView[]> {
    const bookInfos = await this.repos.getByStatus('wish');
    return bookInfos.map(item => new BookInfoView(item));
  }

  /**読んでいる本ステータスの書誌データを取得する */
  public async getReading(): Promise<BookInfoView[]> {
    const bookInfos = await this.repos.getByStatus('reading');
    return bookInfos.map(item => new BookInfoView(item));
  }

  /**読み終わった本ステータスの書誌データを取得する */
  public async getComplete(): Promise<BookInfoView[]> {
    const bookInfos = await this.repos.getByStatus('complete');
    return bookInfos.map(item => new BookInfoView(item));
  }

  /**直近で読んだ書誌データを取得する */
  public async getRecent(): Promise<BookInfoView | undefined> {
    const bookInfo = await this.repos.getRecent();
    return bookInfo ? new BookInfoView(bookInfo) : undefined;
  }

  /**1週間に読んだページ数を取得する */
  public async getHistory(): Promise<Map<string, number> | undefined> {
    const pageHistory = await this.repos.getPageHistory();
    return getPageHistoryMapInCurrentWeek(pageHistory);
  }

  /**書誌データを保存する */
  public async create(postData: books_v1.Schema$Volumes): Promise<bookInfoChangeResponse> {
    const { ok: isSuccess, status } = await this.repos.insert(postData);
    const message =
      isSuccess ? '登録しました' :
        status === 409 ? '登録済みの書籍です' : '登録に失敗しました。\<br\>時間をおいて再度登録してください。';

    return { isSuccess, message };
  }

  /**書誌データを更新する */
  public async update(bookInfo: BookInfo, isComplete: boolean): Promise<bookInfoChangeResponse> {
    const { ok: isSuccess } = await this.repos.update(bookInfo, isComplete);
    const message = isSuccess ? '更新しました。' : '更新に失敗しました。\<br\>時間をおいてから再度お試しください。';

    return { isSuccess, message };
  }

  /**書誌データを削除する */
  public async delete(id: Id): Promise<bookInfoChangeResponse> {
    const { ok: isSuccess } = await this.repos.delete(id.value);
    const message = isSuccess ? '削除しました' : '削除に失敗しました。\<br\>時間をおいて再度登録してください。';

    return { isSuccess, message };
  }

  public addPageHistory(bookInfo: BookInfo, readingDate: string, readingCount: number): bookInfoChangeResponse {
    const isValidDate = validateReadingDate(readingDate);
    const isValidCount = validateReadingCount(readingCount, bookInfo.getPageCount());
    if (!isValidDate || !isValidCount) { return { isSuccess: false, message: '' }; }

    const item = new PageHistory({
      date: convertReadingDateToDate(readingDate),
      pageCount: readingCount
    });

    let message = '';
    let status = undefined;
    if (bookInfo.getStatus().value === 'wish' && bookInfo.getPageHistories()?.length === 1) {
      status = new Status('reading');
      message = 'ステータスを「読んでいる本」に変更しました。';
    } else if (bookInfo.getStatus().value !== 'complete' && readingCount === bookInfo.getPageCount()) {
      status = new Status('complete');
      message = 'ステータスを「読み終わった本」に変更しました。';
    }

    bookInfo.addPageHistory(item);
    if (status) { bookInfo.setStatus(status); }

    return { isSuccess: true, message };
  }
}