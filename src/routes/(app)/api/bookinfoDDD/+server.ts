import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { verifyAndCreateUserId } from '$lib/server/Helpers/SvelteAPI';
import collections from '$lib/server/database/collections';
import DBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import { BookInfoMongoDB } from '$lib/server/Infrastructure/MongoDB/BookInfoDB';
import type { books_v1 } from 'googleapis';
import type { BookInfo } from '$lib/server/Domain/Entities/BookInfo';

/**書誌データを取得する
 * クエリパラメータに応じて返却するデータを変更する。
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const repos = new BookInfoMongoDB(collections.bookInfos!, userId!);

  const param = url.searchParams;
  const getType = param.get('recent') === 'true' ? 'recent' :
                  param.get('wish') === 'true' ? 'wish' :
                  param.get('reading') === 'true' ? 'reading' :
                  param.get('complete') === 'true' ? 'complete' : 'default';

  //クエリパラメータに応じてデータを変更
  let mongoDBModel: DBModel[] = [];
  switch (getType) {
    case 'recent':
      mongoDBModel = await repos.getRecent();
      break;
    case 'wish': 
    case 'reading': 
    case 'complete': 
      mongoDBModel = await repos.getByStatus(getType);
      break;
    default:  
      mongoDBModel = await repos.get();
      break;
  }

  return json(mongoDBModel, { status: 200 });
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const repos = new BookInfoMongoDB(collections.bookInfos!, userId!);

  //重複確認
  // if (await this.isDuplicate(bookInfo.gapiId!)){
  //   return new Response('登録済みの書誌データです。', {status: 409}); //409conflict
  // }

  const item = await request.json() as books_v1.Schema$Volume;
  return await repos.insert(new DBModel(item!, userId!.value));
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  //Postされたデータの型はモデルではなくEntity
  const item = await request.json() as { bookInfo: BookInfo, isComplete: boolean };
  const repos = new BookInfoMongoDB(collections.bookInfos!, userId);

  //作り直してから呼ぶ
  //if (!validatePutItem(item)) { return new Response('データが不正です', { status: 400}); }
  return await repos.update(new DBModel(item.bookInfo), item.isComplete);
}

/**DBの書誌データを削除する */
export const DELETE: RequestHandler = async ({ request, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const id: string = await request.json();
  if (!id) { return new Response('データが不正です', { status: 400 }); }

  const repos = new BookInfoMongoDB(collections.bookInfos!, userId);

  return await repos.delete(id);
};

//どっかに作り直す
/**更新用データが不正でないか確認する */
const validatePutItem = ({ bookInfo, isComplete }: { bookInfo: BookInfo, isComplete: boolean }): boolean => {
  let result = true;

  //作成直後はhistoryが空なのでそのままtrue、編集してある場合は中身が不正でないか調べる。
  if (!bookInfo.pageHistories) { return result; }
  bookInfo.pageHistories.forEach(item => {
    if (!result) { return; }

    if (!item.value.date) {
      result = false;
      return;
    }
    //汎用処理なのでどっかに作り直してから呼ぶ
    // if (!validateReadingCount(item.value.pageCount, bookInfo.pageCount)) {
    //     result = false;
    //     return;
    // }
  });

  //読み終わっている場合、最終ページの記録があるか確認
  if (isComplete && result) {
    const isExist = bookInfo.pageHistories.findIndex(item => item.value.pageCount === bookInfo.pageCount);
    result = isExist !== -1 ? true : false;
  }

  return result;
}