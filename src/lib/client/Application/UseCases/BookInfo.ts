import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import { error } from "@sveltejs/kit";
import type { books_v1 } from "googleapis";

export class BookInfoUseCase {
  /**登録済みの全書誌データ取得する */
  public async getAll(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo');
    if (!response.ok) {
      //throw error(response.status);
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  /**読みたい本ステータスの書誌データを取得する */
  public async getWish(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo/wish');
    if (!response.ok) {
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  /**読んでいる本ステータスの書誌データを取得する */
  public async getReading(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo/reading');
    if (!response.ok) {
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  /**読み終わった本ステータスの書誌データを取得する */
  public async getComplete(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo/complete');
    if (!response.ok) {
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  /**直近で読んだ書誌データを取得する */
  public async getRecent(): Promise<BookInfo | undefined> {
    const bookInfo = await fetch('/api/bookinfo?recentbook=true');
    if (!bookInfo.ok) {
      return undefined;
    }

    await bookInfo.json() as BookInfo;
  }

  /**1週間に読んだページ数を取得する */
  public async getHistory(): Promise<Map<string, number> | undefined> {
    const history = await fetch('/api/bookinfo?history=true');
    if (!history.ok) {
      throw error(history.status);
    }
    
    return this.getPageCountInCurrentWeek(await history.json());
  }

  /**書誌データの配列から、文字列の日付と、ページ数を持つmapを作成する */
  private getPageCountInCurrentWeek(bookInfos: BookInfo[]): Map<string, number> {
    const today = new Date();
    const pageMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      pageMap.set(date.toLocaleDateString('ja-JP'), 0);
    }
  
    if (!bookInfos) { return pageMap; }
  
    //先週の0時0分を取得
    today.setDate(today.getDate() - 6);
    const lastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    //各書誌データのHistoryを確認して1日に読んだページ数を取得
    bookInfos.forEach(bookInfo => {
      //今週分のhistoryを取得し、日付の重複を排除する(残すのは最大のページ数)
      const historyInCurrentWeek = bookInfo.pageHistories?.filter(item => new Date(item.value.date) >= lastDate);
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
  public async post(postDate: books_v1.Schema$Volumes): Promise<{ isSuccess: boolean, message: string }> {
    const { ok: isSuccess, status } = await fetch('/api/bookinfo', {
      method: 'POST',
      body: JSON.stringify(postDate),
      headers: { 'Content-type': 'application/json' }
    });
    const message =
      isSuccess ? '登録しました' :
      status === 409 ? '登録済みの書籍です' : '登録に失敗しました。\<br\>時間をおいて再度登録してください。';

    return { isSuccess, message };
  }

  /**書誌データを更新する */
  public async put(bookInfo: BookInfo, isComplete: boolean): Promise<{ isSuccess: boolean, message: string }> {
    // 引数が不正でないか、とか調べる？
    const { ok: isSuccess } = await fetch('/api/bookinfo', {
      method: 'PUT',
      body: JSON.stringify({ bookInfo, isComplete }),
      headers: { 'Content-type': 'application/json' }
    });
    const message = isSuccess ? '更新しました。' : '更新に失敗しました。\<br\>時間をおいてから再度お試しください。';

    return { isSuccess, message };
  }

  /**書誌データを削除する */
  public async delete(id: Id): Promise<{ isSuccess: boolean, message: string }> {
    const { ok: isSuccess } = await fetch('/api/bookinfo', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: { 'Content-type': 'application/json' }
    });
    const message = isSuccess ? '削除しました' : '削除に失敗しました。\<br\>時間をおいて再度登録してください。';

    return { isSuccess, message };
  }
}