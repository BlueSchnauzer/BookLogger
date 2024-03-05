import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { IBookInfoAPIRequestRepository } from "$lib/server/Domain/repositories/BookInfoAPIRequest";
import { error } from "@sveltejs/kit";
import type { books_v1 } from "googleapis";

export class BookInfoSvelteAPIRequest implements IBookInfoAPIRequestRepository {
  async get(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo');
    if (!response.ok) {
      //throw error(response.status);
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  async getWish(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo/wish');
    if (!response.ok) {
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  async getReading(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo/reading');
    if (!response.ok) {
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  async getComplete(): Promise<BookInfo[]> {
    const response = await fetch('/api/bookinfo/complete');
    if (!response.ok) {
      return [];
    }
    
    return await response.json() as BookInfo[];
  }

  async getRecent(): Promise<BookInfo | undefined> {
    const bookInfo = await fetch('/api/bookinfo?recentbook=true');
    if (!bookInfo.ok) {
      return undefined;
    }

    await bookInfo.json() as BookInfo;
  }

  async getHistory(): Promise<Map<string, number> | undefined> {
    const history = await fetch('/api/bookinfo?history=true');
    if (!history.ok) {
      throw error(history.status);
    }
    
    return this.getPageCountInCurrentWeek(await history.json());
  }

  /**書誌データの配列から、文字列の日付と、ページ数を持つmapを作成する */
  getPageCountInCurrentWeek(bookInfos: BookInfo[]): Map<string, number> {
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
      const historyInCurrentWeek = bookInfo.pageHistory?.filter(item => new Date(item.date) >= lastDate);
      const historyMap = new Map<string, number>();
  
      historyInCurrentWeek?.forEach(item => {
        //DBから取ったデータは文字列になっているため変換
        const key = new Date(item.date).toLocaleDateString('ja-JP');
        if (!historyMap.has(key) || historyMap.get(key)! < item.currentPage) {
          historyMap.set(key, item.currentPage);
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

  async post(postDate: books_v1.Schema$Volumes): Promise<{ isSuccess: boolean, message: string }> {
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

  async put(bookInfo: BookInfo, isComplete: boolean): Promise<{ isSuccess: boolean, message: string }> {
    // 引数が不正でないか、とか調べる？
    const { ok: isSuccess } = await fetch('/api/bookinfo', {
      method: 'PUT',
      body: JSON.stringify({ bookInfo, isComplete }),
      headers: { 'Content-type': 'application/json' }
    });
    const message = isSuccess ? '更新しました。' : '更新に失敗しました。\<br\>時間をおいてから再度お試しください。';

    return { isSuccess, message };
  }

  async delete(bookInfo: BookInfo): Promise<{ isSuccess: boolean, message: string }> {
    const { ok: isSuccess } = await fetch('/api/bookinfo', {
      method: 'DELETE',
      body: JSON.stringify(bookInfo._id),
      headers: { 'Content-type': 'application/json' }
    });
    const message = isSuccess ? '削除しました' : '削除に失敗しました。\<br\>時間をおいて再度登録してください。';

    return { isSuccess, message };
  }
}