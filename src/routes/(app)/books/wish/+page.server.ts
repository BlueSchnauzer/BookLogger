import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
  //読みたい本のみを取得
  const response = await fetch('/api/bookinfo/wish');
  if (!response.ok) {
    throw error(response.status);
  }
  
  let bookInfos: BookInfo[] = await response.json();

  return {
    bookInfos,
    emptyMessage: '読みたい本が登録されていません。<br>右上の追加ボタンから本を検索して登録してください！'
  };
}) satisfies PageServerLoad;