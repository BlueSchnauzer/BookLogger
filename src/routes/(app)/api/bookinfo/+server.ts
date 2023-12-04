import type { RequestHandler } from './$types';
import collections from '$lib/server/database/collections';
import * as service from '$lib/server/database/bookInfo.service';
import { json } from '@sveltejs/kit';
import type { books_v1 } from 'googleapis';
import { BookInfo } from '$lib/server/models/BookInfo';
import { validateReadingCount } from '$lib/utils/validation';

/**DBからユーザIDに一致するデータを取得する */
export const GET: RequestHandler = async ({ url }) => {
    const userId = 1; //todo クッキーから取る？
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    let bookInfos: BookInfo[];
    if (url.searchParams.get('recentbook') === 'true'){
        //直近で読んだ書誌データを取得
        bookInfos = await service.getRecentBookInfo(collections, userId);
    } else if (url.searchParams.get('history') === 'true'){
        //書誌データのhistoryのみを取得
        bookInfos = await service.getBookInfoWithOnlyHistory(collections, userId);
    } else {
        //全書誌データを取得
        bookInfos = await service.getBookInfo(collections, userId);    
    }
    return json(bookInfos, {status: 200});    
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request }) => {
    const userId = 1; //クッキーから取る？
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    const item = await request.json() as books_v1.Schema$Volume;
    const bookInfoToInsert = new BookInfo(item, userId); //ユーザIDを取る

    return await service.insertBookInfo(collections, bookInfoToInsert);
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request }) => {
    const userId = 1; //todo クッキーから取る？無かったらエラー
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    const item = await request.json() as {bookInfo: BookInfo, isComplete: boolean};
    if (!validatePutItem(item)) { return new Response('データが不正です', { status: 400}); }

    return await service.updateBookInfo(collections, item.bookInfo, item.isComplete);
};

/**DBの書誌データを削除する */
export const DELETE: RequestHandler = async ({ request }) => {
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    const _id = await request.json();
    if (!_id) { return new Response('データが不正です', { status: 400}); }

    return await service.deleteBookInfo(collections, _id);
};

/**更新用データが不正でないか確認する */
const validatePutItem = ({bookInfo, isComplete}: {bookInfo: BookInfo, isComplete: boolean}): boolean => {
    if (!bookInfo._id) { 
        return false;
    }

    let result = true;

    //作成直後はhistoryが空なのでそのままtrue、編集してある場合は中身が不正でないか調べる。
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

    //読み終わっている場合、最終ページの記録があるか確認
    if (isComplete && result){
        const isExist = bookInfo.history.findIndex(item => item.currentPage === bookInfo.pageCount);
        result = isExist !== -1 ? true : false;
    }

    return result;
}