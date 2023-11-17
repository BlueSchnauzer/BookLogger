import type { RequestHandler } from '../$types';
import collections from '$lib/server/database/collections';
import { json } from '@sveltejs/kit';
import { getBookInfoByStatus } from '$lib/server/database/bookInfo.service';

/**DBから読んでいる本で、ユーザIDに一致するデータを取得する */
export const GET: RequestHandler = async () => {
    const userId = 1; //todo クッキーから取る？無ければエラー

    if (!collections) { return json(userId, {status: 500});}
    let bookInfos = await getBookInfoByStatus(collections, userId, 'complete');

    return json(bookInfos, {status: 200});
};
