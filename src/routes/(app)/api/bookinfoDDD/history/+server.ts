import type { RequestHandler } from "../../bookinfo/$types";
import collections from '$lib/server/database/collections';
import { json } from '@sveltejs/kit';
import { BookInfoMongoDBResource } from "$lib/server/Infrastructure/MongoDB/BookInfoDBResource";
import { verifyAndGetUid } from "$lib/server/verification";
import { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";

export const GET: RequestHandler = async ({ cookies }) => {
  const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
  if (!userId) { return new Response('ログイン情報が不正です', { status: 400 }); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const response = await new BookInfoMongoDBResource(collections.bookInfos!, userId).getPageHistory();

  return json(response, { status: 200 });
};

const verifyAndCreateUserId = async (idToken: string) => {
  let userId;

  try {
    const token = await verifyAndGetUid(idToken);
    userId = new UserId(token!);
  }
  catch (error) {
    console.log(error);
    console.log('UserIdの取得に失敗しました。');
    return undefined;
  }
  
  return userId;
}
