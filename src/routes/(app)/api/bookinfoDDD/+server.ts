import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { validatePutBookInfo } from '$lib/client/Utils/Validation';
import collections from '$lib/server/database/collections';
import DBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import { verifyAndCreateUserId } from '$lib/server/Helpers/SvelteAPI';
import { BookInfoMongoDBResource } from '$lib/server/Infrastructure/MongoDB/BookInfoDBResource';
import { json } from '@sveltejs/kit';
import type { books_v1 } from 'googleapis';
import type { RequestHandler } from './$types';

/**書誌データを取得する
 * クエリパラメータに応じて返却するデータを変更する。
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId!);

  const param = url.searchParams;
  const getType = param.get('type');

  //クエリパラメータに応じてデータを変更
  let mongoDBModels: DBModel[] = [];
  switch (getType) {
    case 'recent':
      const mongoDBModel = await repos.getRecent();
      return json(mongoDBModel, { status: 200 });
    case 'wish':
    case 'reading':
    case 'complete':
      mongoDBModels = await repos.getByStatus(getType);
      return json(mongoDBModels, { status: 200 });
    default:
      mongoDBModels = await repos.get();
      return json(mongoDBModels, { status: 200 });
  }
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId!);

  const item = await request.json() as books_v1.Schema$Volume;
  return await repos.insert(new DBModel(item, userId.value));
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  //Postされたデータの型はモデルではなくEntity
  const item = await request.json() as { bookInfo: BookInfo, isCompleteReading: boolean };
  const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId);

  if (!validatePutBookInfo(item)) { return new Response('データが不正です', { status: 400 }); }
  return await repos.update(new DBModel(item.bookInfo), item.isCompleteReading);
}

/**DBの書誌データを削除する */
export const DELETE: RequestHandler = async ({ request, cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const id: string = await request.json();
  if (!id) { return new Response('データが不正です', { status: 400 }); }

  const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId);

  return await repos.delete(id);
};