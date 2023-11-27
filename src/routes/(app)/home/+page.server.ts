import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async ({ fetch }) => {
  //直近で読んだ書誌データを取得
  const recentBook = await fetch('/api/bookinfo?recentbook=true');
  if (!recentBook.ok) {
    throw error(recentBook.status);
  }

  //書誌データのhistoryのみを取得
  const history = await fetch('/api/bookinfo?history=true');
  if (!history.ok) {
    throw error(history.status);
  }
  
  const bookInfos: BookInfo[] = await recentBook.json();
  const pagesWithDate = getPageCountInCurrentWeek(await history.json());
  
  return { bookInfos, pagesWithDate };
}) satisfies PageServerLoad;

const getPageCountInCurrentWeek = (bookInfos: BookInfo[]) => {
  if (bookInfos == null) { return []; }

  //操作しやすくするためにstringで保持
  let dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('ja-JP'));
  }

  //日付の文字列をプロパティ名とし、値にはページ数を持つオブジェクトを作成
  let pagesWithDate = dates.map(date => ({date: date, pageCount: 0}));

  const today = new Date();
  today.setDate(today.getDate() - 6);
  //先週の0時0分を取得
  const lastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  bookInfos.forEach(bookInfo => {
    //今週のhistoryを取得
    const historyInCurrentWeek = bookInfo.history?.filter(item => new Date(item.date) >= lastDate);

    //今週分の読んだ記録があれば、ページ数を加算
    historyInCurrentWeek?.forEach(item => {
      const itemDate = new Date(item.date).toLocaleDateString('ja-JP');
      const matchedData = pagesWithDate.find(pageData => pageData.date === itemDate);
      if (matchedData) { matchedData.pageCount += item.currentPage;}
    })
  });

  return pagesWithDate;
}