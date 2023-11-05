import type { RequestHandler } from './$types';
import collections from '$lib/server/database/collections';
import { deleteBookInfo, getBookInfo, insertBookInfo, updateBookInfo } from '$lib/server/database/bookInfo.service';
import { json } from '@sveltejs/kit';
import type { books_v1 } from 'googleapis';
import { BookInfo } from '$lib/server/models/BookInfo';
import { validateReadingCount } from '$lib/utils';

/**DBからユーザIDに一致するデータを取得する */
export const GET: RequestHandler = async () => {
    const userId = 1; //クッキーから取る？
    try {
        if (!collections) { return json(userId, {status: 500});}
        let bookInfos = await getBookInfo(collections, userId);

        return json(bookInfos);    
    }
    catch (error){
        return json(userId, {status: 500});
    }
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request }) => {
    const userId = 1; //クッキーから取る？
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    const item = await request.json() as books_v1.Schema$Volume;
    const bookInfoToInsert = new BookInfo(item, 1); //ユーザIDを取る

    //一旦そのまま返す
    return await insertBookInfo(collections, bookInfoToInsert);
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request }) => {
    const userId = 1; //クッキーから取る？
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    const item = await request.json() as BookInfo;
    if (!validatePutItem(item)) { return new Response('データが不正です', { status: 400}); }

    return await updateBookInfo(collections, item);
};

/**DBの書誌データを削除する */
export const DELETE: RequestHandler = async ({ request }) => {
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    const _id = await request.json();
    if (!_id) { return new Response('データが不正です', { status: 400}); }

    return await deleteBookInfo(collections, _id);
};

/**更新用データが不正でないか確認する */
const validatePutItem = (bookInfo: BookInfo): boolean => {
    if (!bookInfo._id) { 
        return false;
    }

    let result = true;
    if (!bookInfo.history) { return result; }
    
    bookInfo.history.forEach(item => {
        if (!result) { return; }

        if (!item.date) {
            result = false;
            return;
        }
        if (!validateReadingCount(item.currentPage, bookInfo.pageCount)) {
            result = false;
            return;
        }
    });

    return result;
}