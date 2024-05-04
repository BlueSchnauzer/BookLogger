import type { RequestHandler } from "../../bookinfo/$types";
import { verifyAndGetUid } from "$lib/server/verification";
import collections from '$lib/server/database/collections';
import { json } from '@sveltejs/kit';
import { BookInfoEntity } from "$lib/server/Infrastructure/MongoDB/BookInfoEntity";

export const GET: RequestHandler = async ({ cookies }) => {
  const userId = await verifyAndGetUid(cookies.get('idToken'));
    
  if (!userId) { return json('ログイン情報が不正です', {status: 400}); }
  if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

  const response = await new BookInfoEntity().getPageHistory();

  return json(response, { status: 200 });
};