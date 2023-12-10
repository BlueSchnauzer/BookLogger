import type { RequestHandler } from './$types';
import collections from '$lib/server/database/collections';
import { json } from '@sveltejs/kit';
import { getBookInfoByStatus } from '$lib/server/database/bookInfo.service';
import { verifyAndGetUid } from '$lib/server/verification';

/**DBから読みたい本で、ユーザIDに一致するデータを取得する */
export const GET: RequestHandler = async ({ cookies }) => {
    const userId = await verifyAndGetUid(cookies.get('idToken'));
    
    if (!userId) { return json('ログイン情報が不正です', {status: 400}); }
    if (!collections) { return json('サーバーエラー', {status: 500}); }
    
    let bookInfos = await getBookInfoByStatus(collections, userId, 'wish');

    return json(bookInfos, {status: 200});
};
