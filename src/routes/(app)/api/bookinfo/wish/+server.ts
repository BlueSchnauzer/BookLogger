import type { RequestHandler } from './$types';
import collections from '$lib/server/database/collections';
import { json } from '@sveltejs/kit';
import { getWishBookInfo } from '$lib/server/database/bookInfo.service';

/**DBから読みたい本で、ユーザIDに一致するデータを取得する */
export const GET: RequestHandler = async () => {
    const userId = 1; //todo クッキーから取る？無ければエラー

    if (!collections) { return json(userId, {status: 500});}
    let bookInfos = await getWishBookInfo(collections, userId);

    return json(bookInfos);
};
