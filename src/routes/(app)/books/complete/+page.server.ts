import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async ({ fetch }) => {
  //読んでいる本のみを取得
  const response = await fetch('/api/bookinfo/complete');
  if (!response.ok) {
    //todo エラーページにリダイレクト
  }
  
  let bookInfos: BookInfo[] = await response.json();

  return {
    bookInfos,
    emptyMessage: '読み終わった本が登録されていません。<br>本の詳細画面を開いて読んだ記録を追加してください！'
  };
}) satisfies PageServerLoad;