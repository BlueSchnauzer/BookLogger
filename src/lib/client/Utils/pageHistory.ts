import type { PageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";

/**書誌データの配列から、文字列の日付と、ページ数を持つmapを作成する */
export const getPageHistoryMapInCurrentWeek = (pageHistory: PageHistory[][]): Map<string, number> => {
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
