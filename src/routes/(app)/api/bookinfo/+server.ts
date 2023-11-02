import type { RequestHandler } from './$types';
import { getBookInfoByUserId, insertBookInfo, updateBookInfo } from '$lib/server/services/database.service';
import { json } from '@sveltejs/kit';
import type { books_v1 } from 'googleapis';
import { BookInfo } from '$lib/server/models/BookInfo';
import { validateReadingCount, validateReadingDate } from '$lib/utils';

/**DBからユーザIDに一致するデータを取得する */
export const GET: RequestHandler = async () => {
    const userId = 1; //クッキーから取る？
    try {
        let bookInfos = await getBookInfoByUserId(userId);

        return json(bookInfos);    
    }
    catch (error){
        return json(userId, {status: 500});
    }
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request }) => {
    const item = await request.json() as books_v1.Schema$Volume;
    const bookInfoToInsert = new BookInfo(item, 1); //ユーザIDを取る

    //一旦そのまま返す
    return await insertBookInfo(bookInfoToInsert);
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request }) => {
    const item = await request.json() as BookInfo;
    if (!validatePutItem(item)) { return new Response('データが不正です', { status: 400}); }

    return await updateBookInfo(item);
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