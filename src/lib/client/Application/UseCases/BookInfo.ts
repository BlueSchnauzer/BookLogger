import { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import { PageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";
import type { IBookInfoEntityRepository } from "$lib/server/Domain/repositories/BookInfoEntity";
import type { books_v1 } from "googleapis";
import { BookInfoArrayView } from "$lib/client/Application/Views/BookInfoArray";
import { BookInfoView } from "$lib/client/Application/Views/BookInfo";
import { validateReadingCount, validateReadingDate } from "$lib/client/Application/Utils/validation";
import { convertReadingDateToDate } from "$lib/client/Application/Utils/date";
import { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";

export interface bookInfoChangeResponse {
  isSuccess: boolean,
  message: string
}

/**書誌データの操作を管理するUseCase */
export class BookInfoUseCase {
  constructor(private readonly repos: IBookInfoEntityRepository) { }

  /**登録済みの全書誌データ取得する */
  public async get(): Promise<BookInfoArrayView> {
    const bookInfos = await this.repos.get();
    return new BookInfoArrayView(bookInfos);
  }

  /**読みたい本ステータスの書誌データを取得する */
  public async getWish(): Promise<BookInfoArrayView> {
    const bookInfos = await this.repos.getByStatus('wish');
    return new BookInfoArrayView(bookInfos);
  }

  /**読んでいる本ステータスの書誌データを取得する */
  public async getReading(): Promise<BookInfoArrayView> {
    const bookInfos = await this.repos.getByStatus('reading');
    return new BookInfoArrayView(bookInfos);
  }

  /**読み終わった本ステータスの書誌データを取得する */
  public async getComplete(): Promise<BookInfoArrayView> {
    const bookInfos = await this.repos.getByStatus('complete');
    return new BookInfoArrayView(bookInfos);
  }

  /**直近で読んだ書誌データを取得する */
  public async getRecent(): Promise<BookInfoView | undefined> {
    const bookInfo = await this.repos.getRecent();
    return bookInfo ? new BookInfoView(bookInfo) : undefined;
  }

  /**1週間に読んだページ数を取得する */
  public async getHistory(): Promise<Map<string, number> | undefined> {
    const pageHistory = await this.repos.getPageHistory();
    return this.getPageCountInCurrentWeek(pageHistory);
  }

  /**書誌データの配列から、文字列の日付と、ページ数を持つmapを作成する */
  private getPageCountInCurrentWeek(pageHistory: PageHistory[][]): Map<string, number> {
    const today = new Date();
    const pageMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      pageMap.set(date.toLocaleDateString('ja-JP'), 0);
    }

    if (!pageHistory.length) { return pageMap; }

    //先週の0時0分を取得
    today.setDate(today.getDate() - 6);
    const lastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    //各書誌データのHistoryを確認して1日に読んだページ数を取得
    pageHistory.forEach(item => {
      //今週分のhistoryを取得し、日付の重複を排除する(残すのは最大のページ数)
      const historyInCurrentWeek = item.filter(pageHistory => new Date(pageHistory.value.date) >= lastDate);
      const historyMap = new Map<string, number>();

      historyInCurrentWeek?.forEach(item => {
        //DBから取ったデータは文字列になっているため変換
        const key = new Date(item.value.date).toLocaleDateString('ja-JP');
        if (!historyMap.has(key) || historyMap.get(key)! < item.value.pageCount) {
          historyMap.set(key, item.value.pageCount);
        }
      });

      if (historyMap.size === 0) { return; }

      //ページ数を加算する
      historyMap.forEach((value, key) => {
        if (pageMap.has(key)) {
          const orgValue = pageMap.get(key);
          pageMap.set(key, orgValue! + value);
        }
      });
    });

    return pageMap;
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
    const isValidCount = validateReadingCount(readingCount, bookInfo.pageCount);
    if (!isValidDate || !isValidCount) { return { isSuccess: false, message: '' }; }

    const item = new PageHistory({
      id: crypto.randomUUID(),
      date: convertReadingDateToDate(readingDate),
      pageCount: readingCount
    });

    let message = '';
    let status = undefined;
    if (bookInfo.status.value === 'wish' && bookInfo.pageHistories?.length === 1) {
      status = new Status('reading');
      message = 'ステータスを「読んでいる本」に変更しました。';
    } else if (bookInfo.status.value !== 'complete' && readingCount === bookInfo.pageCount) {
      status = new Status('complete');
      message = 'ステータスを「読み終わった本」に変更しました。';
    }

    bookInfo.updatePageHistory(item);
    if (status) { bookInfo.changeStatus(status); }

    return { isSuccess: true, message };
  }

  public changeStatus() {
    //いらない？
  }
}