import type { RequestHandler } from './$types';
import { getBookInfoByUserId, insertBookInfo } from '$lib/server/services/database.service';
import { json } from '@sveltejs/kit';
import type { books_v1 } from 'googleapis';
import { BookInfo } from '$lib/server/models/BookInfo';

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

/**DBで書誌データを保存する */
export const POST: RequestHandler = async ({ request }) => {
    const item = await request.json() as books_v1.Schema$Volume;
    const bookInfoToInsert = new BookInfo(item, 1); //ユーザIDを取る

    //一旦そのまま返す
    return await insertBookInfo(bookInfoToInsert);
};